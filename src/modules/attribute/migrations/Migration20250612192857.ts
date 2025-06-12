import { Migration } from '@mikro-orm/migrations';

export class Migration20250612192857 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "attribute_possible_value" drop constraint if exists "attribute_possible_value_attribute_id_foreign";`);

    this.addSql(`alter table if exists "attribute_possible_value" add constraint "attribute_possible_value_attribute_id_foreign" foreign key ("attribute_id") references "attribute" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "attribute_possible_value" drop constraint if exists "attribute_possible_value_attribute_id_foreign";`);

    this.addSql(`alter table if exists "attribute_possible_value" add constraint "attribute_possible_value_attribute_id_foreign" foreign key ("attribute_id") references "attribute" ("id") on update cascade;`);
  }

}
