import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey, TableColumn } from 'typeorm';

export class AddTelegramSignalTables1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create signal_sources table
    await queryRunner.createTable(
      new Table({
        name: 'signal_sources',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'platform',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'external_chat_id',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'display_name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_trusted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'signal_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'parsed_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'rejected_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'last_signal_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'average_confidence',
            type: 'float',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add unique index on platform + external_chat_id
    await queryRunner.createIndex(
      'signal_sources',
      new TableIndex({
        name: 'idx_signal_sources_platform_chat',
        columnNames: ['platform', 'external_chat_id'],
        isUnique: true,
      }),
    );

    // Add index on is_trusted
    await queryRunner.createIndex(
      'signal_sources',
      new TableIndex({
        name: 'idx_signal_sources_trusted',
        columnNames: ['is_trusted', 'created_at'],
      }),
    );

    // Alter signals table to add new columns
    await queryRunner.addColumn(
      'signals',
      new TableColumn({
        name: 'source_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'signals',
      new TableColumn({
        name: 'external_message_id',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'signals',
      new TableColumn({
        name: 'parse_errors',
        type: 'text',
        isArray: true,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'signals',
      new TableColumn({
        name: 'expires_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'signals',
      new TableForeignKey({
        columnNames: ['source_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'signal_sources',
        onDelete: 'CASCADE',
      }),
    );

    // Add indexes for signals table
    await queryRunner.createIndex(
      'signals',
      new TableIndex({
        name: 'idx_signals_source_status',
        columnNames: ['source_id', 'status', 'created_at'],
      }),
    );

    await queryRunner.createIndex(
      'signals',
      new TableIndex({
        name: 'idx_signals_external_message',
        columnNames: ['external_message_id', 'source_id'],
      }),
    );

    await queryRunner.createIndex(
      'signals',
      new TableIndex({
        name: 'idx_signals_expires',
        columnNames: ['status', 'expires_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key
    const table = await queryRunner.getTable('signals');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.includes('source_id'));
    if (foreignKey) {
      await queryRunner.dropForeignKey('signals', foreignKey);
    }

    // Drop indexes
    await queryRunner.dropIndex('signals', 'idx_signals_expires');
    await queryRunner.dropIndex('signals', 'idx_signals_external_message');
    await queryRunner.dropIndex('signals', 'idx_signals_source_status');

    // Drop columns
    await queryRunner.dropColumn('signals', 'expires_at');
    await queryRunner.dropColumn('signals', 'parse_errors');
    await queryRunner.dropColumn('signals', 'external_message_id');
    await queryRunner.dropColumn('signals', 'source_id');

    // Drop signal_sources table
    await queryRunner.dropIndex('signal_sources', 'idx_signal_sources_trusted');
    await queryRunner.dropIndex('signal_sources', 'idx_signal_sources_platform_chat');
    await queryRunner.dropTable('signal_sources');
  }
}
