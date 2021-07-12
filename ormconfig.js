module.exports = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'E4nW7bYb',
	database: 'postgres',
	autoLoadEntities: true,
	synchronize: true,
	entities: ['dist/**/*.entity.js'],
	migrations: ['dist/migrations/*.js'],
	cli: {
		migrationsDir: 'src/migrations'
	}
}
