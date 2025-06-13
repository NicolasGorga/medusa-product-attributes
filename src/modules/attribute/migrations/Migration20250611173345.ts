import { Migration } from '@mikro-orm/migrations';

export class Migration20250611173345 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "attribute" drop constraint if exists "attribute_ui_component_check";`);

    this.addSql(`alter table if exists "attribute" add constraint "attribute_ui_component_check" check("ui_component" in ('select', 'multivalue', 'unit', 'toggle', 'text_area', 'color_picker'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "attribute" drop constraint if exists "attribute_ui_component_check";`);

    this.addSql(`alter table if exists "attribute" add constraint "attribute_ui_component_check" check("ui_component" in ('select', 'multivalue', 'unit', 'toggle', 'text-area', 'color_picker'));`);
  }

}
