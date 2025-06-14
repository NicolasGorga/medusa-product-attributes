import {
    arrayDifference,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaService,
} from "@medusajs/framework/utils";
import Attribute from "./models/attribute";
import { Context, DAL, InferTypeOf } from "@medusajs/framework/types";
import { EntityManager } from "@mikro-orm/knex";
import {
  CreateAttributeValueDTO,
  UpdateAttributeDTO,
  UpsertAttributeValueDTO,
  UpdateAttributeValueDTO,
} from "../../types/attribute";
import AttributeValue from "./models/attribute-value";
import AttributeSet from "./models/attribute-set";
import AttributePossibleValue from "./models/attribute-possible-value";

type Attribute = InferTypeOf<typeof Attribute>
type AttributePossibleValue = InferTypeOf<typeof AttributePossibleValue>

type InjectedDependencies = {
  attributeRepository: DAL.RepositoryService<Attribute>;
  attributePossibleValueRepository: DAL.RepositoryService<AttributePossibleValue>;
};

class AttributeModuleService extends MedusaService({
  Attribute,
  AttributeValue,
  AttributeSet,
  AttributePossibleValue,
}) {
  protected attributeRepository_: DAL.RepositoryService<Attribute>;
  protected attributePossibleValueRepository_: DAL.RepositoryService<AttributePossibleValue>;

  constructor({
    attributeRepository,
    attributePossibleValueRepository,
  }: InjectedDependencies) {
    super(...arguments);
    this.attributeRepository_ = attributeRepository;
    this.attributePossibleValueRepository_ = attributePossibleValueRepository;
  }

  /**
   *
   * @param input
   * @param sharedContext
   *
   * Useful to update attribute, allowing to upsert possible_values in the same operation. If "id"
   * is not provided for "possible_values" entries, it will lookup the DB by attributePossibleValue.value,
   * to update or create accordingly.
   *
   * Assumes caller will eventually refetch entities, for now, to reduce complexity of this
   * method and concentrate on upserting like ProductOption - ProductOptionValue from Medusa
   */
  @InjectManager()
  async updateAttributeWithUpsertOrReplacePossibleValues(
    input: UpdateAttributeDTO | UpdateAttributeDTO[],
    @MedusaContext() sharedContext?: Context<EntityManager>
  ) {
    const normalizedInput = Array.isArray(input) ? input : [input];

    return this.updateAttributeWithUpsertOrReplacePossibleValues_(
      normalizedInput,
      sharedContext
    );
  }

  @InjectTransactionManager()
  protected async updateAttributeWithUpsertOrReplacePossibleValues_(
    input: UpdateAttributeDTO[],
    @MedusaContext() sharedContext?: Context<EntityManager>
  ) {
    // When debugging this, it only seems to have the id proprty returned
    // so i refetch the entities
    const upsertedValues = await this.attributePossibleValueRepository_.upsert(
      input.flatMap((element) => element.possible_values),
      sharedContext
    );

    // const upsertedValues = await this.listAttributePossibleValues({
    //   id: upsertedValuesWithoutFields.map(val => val.id)
    // }, undefined, sharedContext)

    const attributesInput = input.map(toUpdate => {
      const { possible_values, product_category_ids, ...attribute } = toUpdate;
      return {
        ...attribute,
        possible_values: upsertedValues
          .filter(val => val.attribute_id === attribute.id)
          .map(upserted => ({ id: upserted.id }))
      }
    });

    return this.attributeRepository_.upsertWithReplace(attributesInput, { relations: ['possible_values'] }, sharedContext)
  }
}

export default AttributeModuleService;
