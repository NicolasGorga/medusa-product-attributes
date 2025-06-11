import { Migration } from '@mikro-orm/migrations';

export class Migration20250611160552 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "attribute" add column if not exists "ui_component" text check ("ui_component" in ('select', 'multivalue', 'unit', 'toggle', 'text-area', 'color_picker')) not null default 'select';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "attribute" drop column if exists "ui_component";`);
  }

}
