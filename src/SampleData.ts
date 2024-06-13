const sampleMarkdown = "| **<br/>The Citus database is 100% open source.<br/><img width=1000/><br/>Learn what's new in the [Citus 12.1 release blog](https://www.citusdata.com/blog/2023/09/22/adding-postgres-16-support-to-citus-12-1/) and the [Citus Updates page](https://www.citusdata.com/updates/).<br/><br/>**|\n" +
    "|---|\n" +
    "<br/>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "## What is Citus?\n" +
    "\n" +
    "Citus is a [PostgreSQL extension](https://www.citusdata.com/blog/2017/10/25/what-it-means-to-be-a-postgresql-extension/) that transforms Postgres into a distributed database—so you can achieve high performance at any scale.\n" +
    "\n" +
    "With Citus, you extend your PostgreSQL database with new superpowers:\n" +
    "\n" +
    "- **Distributed tables** are sharded across a cluster of PostgreSQL nodes to combine their CPU, memory, storage and I/O capacity.\n" +
    "- **References tables** are replicated to all nodes for joins and foreign keys from distributed tables and maximum read performance.\n" +
    "- **Distributed query engine** routes and parallelizes SELECT, DML, and other operations on distributed tables across the cluster.\n" +
    "- **Columnar storage** compresses data, speeds up scans, and supports fast projections, both on regular and distributed tables.\n" +
    "- **Query from any node** enables you to utilize the full capacity of your cluster for distributed queries\n" +
    "\n" +
    "You can use these Citus superpowers to make your Postgres database scale-out ready on a single Citus node. Or you can build a large cluster capable of handling **high transaction throughputs**, especially in **multi-tenant apps**, run **fast analytical queries**, and process large amounts of **time series** or **IoT data** for **real-time analytics**. When your data size and volume grow, you can easily add more worker nodes to the cluster and rebalance the shards.\n" +
    "\n" +
    "Our [SIGMOD '21](https://2021.sigmod.org/) paper [Citus: Distributed PostgreSQL for Data-Intensive Applications](https://doi.org/10.1145/3448016.3457551) gives a more detailed look into what Citus is, how it works, and why it works that way.\n" +
    "\n" +
    "\n" +
    "Since Citus is an extension to Postgres, you can use Citus with the latest Postgres versions. And Citus works seamlessly with the PostgreSQL tools and extensions you are already familiar with.\n" +
    "\n" +
    "- [Why Citus?](#why-citus)\n" +
    "- [Getting Started](#getting-started)\n" +
    "- [Using Citus](#using-citus)\n" +
    "- [Schema-based sharding](#schema-based-sharding)\n" +
    "- [Setting up with High Availability](#setting-up-with-high-availability)\n" +
    "- [Documentation](#documentation)\n" +
    "- [Architecture](#architecture)\n" +
    "- [When to Use Citus](#when-to-use-citus)\n" +
    "- [Need Help?](#need-help)\n" +
    "- [Contributing](#contributing)\n" +
    "- [Stay Connected](#stay-connected)\n" +
    "\n" +
    "## Why Citus?\n" +
    "\n" +
    "Developers choose Citus for two reasons:\n" +
    "\n" +
    "1. Your application is outgrowing a single PostgreSQL node\n" +
    "\n" +
    "\tIf the size and volume of your data increases over time, you may start seeing any number of performance and scalability problems on a single PostgreSQL node. For example: High CPU utilization and I/O wait times slow down your queries, SQL queries return out of memory errors, autovacuum cannot keep up and increases table bloat, etc.\n" +
    "\n" +
    "\tWith Citus you can distribute and optionally compress your tables to always have enough memory, CPU, and I/O capacity to achieve high performance at scale. The distributed query engine can efficiently route transactions across the cluster, while parallelizing analytical queries and batch operations across all cores. Moreover, you can still use the PostgreSQL features and tools you know and love.\n" +
    "\n" +
    "2. PostgreSQL can do things other systems can’t\n" +
    "\n" +
    "\tThere are many data processing systems that are built to scale out, but few have as many powerful capabilities as PostgreSQL, including: Advanced joins and subqueries, user-defined functions, update/delete/upsert, constraints and foreign keys, powerful extensions (e.g. PostGIS, HyperLogLog), many types of indexes, time-partitioning, and sophisticated JSON support.\n" +
    "\n" +
    "\tCitus makes PostgreSQL’s most powerful capabilities work at any scale, allowing you to handle complex data-intensive workloads on a single database system.\n" +
    "\n" +
    "## Getting Started\n" +
    "\n" +
    "The quickest way to get started with Citus is to use the [Azure Cosmos DB for PostgreSQL](https://learn.microsoft.com/azure/cosmos-db/postgresql/quickstart-create-portal) managed service in the cloud—or [set up Citus locally](https://docs.citusdata.com/en/stable/installation/single_node.html).\n" +
    "\n" +
    "### Citus Managed Service on Azure\n" +
    "\n" +
    "You can get a fully-managed Citus cluster in minutes through the [Azure Cosmos DB for PostgreSQL portal](https://azure.microsoft.com/products/cosmos-db/). Azure will manage your backups, high availability through auto-failover, software updates, monitoring, and more for all of your servers. To get started Citus on Azure, use the [Azure Cosmos DB for PostgreSQL Quickstart](https://learn.microsoft.com/azure/cosmos-db/postgresql/quickstart-create-portal).\n" +
    "\n" +
    "### Running Citus using Docker\n" +
    "\n" +
    "The smallest possible Citus cluster is a single PostgreSQL node with the Citus extension, which means you can try out Citus by running a single Docker container.\n" +
    "\n" +
    "```bash\n" +
    "# run PostgreSQL with Citus on port 5500\n" +
    "docker run -d --name citus -p 5500:5432 -e POSTGRES_PASSWORD=mypassword citusdata/citus\n" +
    "\n" +
    "# connect using psql within the Docker container\n" +
    "docker exec -it citus psql -U postgres\n" +
    "\n" +
    "# or, connect using local psql\n" +
    "psql -U postgres -d postgres -h localhost -p 5500\n" +
    "```\n" +
    "\n" +
    "### Install Citus locally\n" +
    "\n" +
    "If you already have a local PostgreSQL installation, the easiest way to install Citus is to use our packaging repo\n" +
    "\n" +
    "Install packages on Ubuntu / Debian:\n" +
    "\n" +
    "```bash\n" +
    "curl https://install.citusdata.com/community/deb.sh > add-citus-repo.sh\n" +
    "sudo bash add-citus-repo.sh\n" +
    "sudo apt-get -y install postgresql-16-citus-12.1\n" +
    "```\n" +
    "\n" +
    "Install packages on CentOS / Red Hat:\n" +
    "```bash\n" +
    "curl https://install.citusdata.com/community/rpm.sh > add-citus-repo.sh\n" +
    "sudo bash add-citus-repo.sh\n" +
    "sudo yum install -y citus121_16\n" +
    "```\n" +
    "\n" +
    "To add Citus to your local PostgreSQL database, add the following to `postgresql.conf`:\n" +
    "\n" +
    "```\n" +
    "shared_preload_libraries = 'citus'\n" +
    "```\n" +
    "\n" +
    "After restarting PostgreSQL, connect using `psql` and run:\n" +
    "\n" +
    "```sql\n" +
    "CREATE EXTENSION citus;\n" +
    "````\n" +
    "You’re now ready to get started and use Citus tables on a single node.\n" +
    "\n" +
    "### Install Citus on multiple nodes\n" +
    "\n" +
    "If you want to set up a multi-node cluster, you can also set up additional PostgreSQL nodes with the Citus extensions and add them to form a Citus cluster:\n" +
    "\n" +
    "```sql\n" +
    "-- before adding the first worker node, tell future worker nodes how to reach the coordinator\n" +
    "SELECT citus_set_coordinator_host('10.0.0.1', 5432);\n" +
    "\n" +
    "-- add worker nodes\n" +
    "SELECT citus_add_node('10.0.0.2', 5432);\n" +
    "SELECT citus_add_node('10.0.0.3', 5432);\n" +
    "\n" +
    "-- rebalance the shards over the new worker nodes\n" +
    "SELECT rebalance_table_shards();\n" +
    "```\n" +
    "\n" +
    "For more details, see our [documentation on how to set up a multi-node Citus cluster](https://docs.citusdata.com/en/stable/installation/multi_node.html) on various operating systems.\n" +
    "\n" +
    "## Using Citus\n" +
    "\n" +
    "Once you have your Citus cluster, you can start creating distributed tables, reference tables and use columnar storage.\n" +
    "\n" +
    "### Creating Distributed Tables\n" +
    "\n" +
    "The `create_distributed_table` UDF will transparently shard your table locally or across the worker nodes:\n" +
    "\n" +
    "```sql\n" +
    "CREATE TABLE events (\n" +
    "  device_id bigint,\n" +
    "  event_id bigserial,\n" +
    "  event_time timestamptz default now(),\n" +
    "  data jsonb not null,\n" +
    "  PRIMARY KEY (device_id, event_id)\n" +
    ");\n" +
    "\n" +
    "-- distribute the events table across shards placed locally or on the worker nodes\n" +
    "SELECT create_distributed_table('events', 'device_id');\n" +
    "```\n" +
    "\n" +
    "After this operation, queries for a specific device ID will be efficiently routed to a single worker node, while queries across device IDs will be parallelized across the cluster.\n" +
    "\n" +
    "```sql\n" +
    "-- insert some events\n" +
    "INSERT INTO events (device_id, data)\n" +
    "SELECT s % 100, ('{\"measurement\":'||random()||'}')::jsonb FROM generate_series(1,1000000) s;\n" +
    "\n" +
    "-- get the last 3 events for device 1, routed to a single node\n" +
    "SELECT * FROM events WHERE device_id = 1 ORDER BY event_time DESC, event_id DESC LIMIT 3;\n" +
    "┌───────────┬──────────┬───────────────────────────────┬───────────────────────────────────────┐\n" +
    "│ device_id │ event_id │          event_time           │                 data                  │\n" +
    "├───────────┼──────────┼───────────────────────────────┼───────────────────────────────────────┤\n" +
    "│         1 │  1999901 │ 2021-03-04 16:00:31.189963+00 │ {\"measurement\": 0.88722643925054}     │\n" +
    "│         1 │  1999801 │ 2021-03-04 16:00:31.189963+00 │ {\"measurement\": 0.6512231304621992}   │\n" +
    "│         1 │  1999701 │ 2021-03-04 16:00:31.189963+00 │ {\"measurement\": 0.019368766051897524} │\n" +
    "└───────────┴──────────┴───────────────────────────────┴───────────────────────────────────────┘\n" +
    "(3 rows)\n" +
    "\n" +
    "Time: 4.588 ms\n" +
    "\n" +
    "-- explain plan for a query that is parallelized across shards, which shows the plan for\n" +
    "-- a query one of the shards and how the aggregation across shards is done\n" +
    "EXPLAIN (VERBOSE ON) SELECT count(*) FROM events;\n" +
    "┌────────────────────────────────────────────────────────────────────────────────────┐\n" +
    "│                                     QUERY PLAN                                     │\n" +
    "├────────────────────────────────────────────────────────────────────────────────────┤\n" +
    "│ Aggregate                                                                          │\n" +
    "│   Output: COALESCE((pg_catalog.sum(remote_scan.count))::bigint, '0'::bigint)       │\n" +
    "│   ->  Custom Scan (Citus Adaptive)                                                 │\n" +
    "│         ...                                                                        │\n" +
    "│         ->  Task                                                                   │\n" +
    "│               Query: SELECT count(*) AS count FROM events_102008 events WHERE true │\n" +
    "│               Node: host=localhost port=5432 dbname=postgres                       │\n" +
    "│               ->  Aggregate                                                        │\n" +
    "│                     ->  Seq Scan on public.events_102008 events                    │\n" +
    "└────────────────────────────────────────────────────────────────────────────────────┘\n" +
    "```\n" +
    "\n" +
    "### Creating Distributed Tables with Co-location\n" +
    "\n" +
    "Distributed tables that have the same distribution column can be co-located to enable high performance distributed joins and foreign keys between distributed tables.\n" +
    "By default, distributed tables will be co-located based on the type of the distribution column, but you define co-location explicitly with the `colocate_with` argument in `create_distributed_table`.\n" +
    "\n" +
    "```sql\n" +
    "CREATE TABLE devices (\n" +
    "  device_id bigint primary key,\n" +
    "  device_name text,\n" +
    "  device_type_id int\n" +
    ");\n" +
    "CREATE INDEX ON devices (device_type_id);\n" +
    "\n" +
    "-- co-locate the devices table with the events table\n" +
    "SELECT create_distributed_table('devices', 'device_id', colocate_with := 'events');\n" +
    "\n" +
    "-- insert device metadata\n" +
    "INSERT INTO devices (device_id, device_name, device_type_id)\n" +
    "SELECT s, 'device-'||s, 55 FROM generate_series(0, 99) s;\n" +
    "\n" +
    "-- optionally: make sure the application can only insert events for a known device\n" +
    "ALTER TABLE events ADD CONSTRAINT device_id_fk\n" +
    "FOREIGN KEY (device_id) REFERENCES devices (device_id);\n" +
    "\n" +
    "-- get the average measurement across all devices of type 55, parallelized across shards\n" +
    "SELECT avg((data->>'measurement')::double precision)\n" +
    "FROM events JOIN devices USING (device_id)\n" +
    "WHERE device_type_id = 55;\n" +
    "\n" +
    "┌────────────────────┐\n" +
    "│        avg         │\n" +
    "├────────────────────┤\n" +
    "│ 0.5000191877513974 │\n" +
    "└────────────────────┘\n" +
    "(1 row)\n" +
    "\n" +
    "Time: 209.961 ms\n" +
    "```\n" +
    "\n" +
    "Co-location also helps you scale [INSERT..SELECT](https://docs.citusdata.com/en/stable/articles/aggregation.html), [stored procedures](https://www.citusdata.com/blog/2020/11/21/making-postgres-stored-procedures-9x-faster-in-citus/), and [distributed transactions](https://www.citusdata.com/blog/2017/06/02/scaling-complex-sql-transactions/).\n" +
    "\n" +
    "### Distributing Tables without interrupting the application\n" +
    "\n" +
    "\n" +
    "Some of you already start with Postgres, and decide to distribute tables later on while your application using the tables. In that case, you want to avoid downtime for both reads and writes. `create_distributed_table` command block writes (e.g., DML commands) on the table until the command is finished. Instead, with `create_distributed_table_concurrently` command, your application can continue to read and write the data even during the command.\n" +
    "\n" +
    "\n" +
    "```sql\n" +
    "CREATE TABLE device_logs (\n" +
    "  device_id bigint primary key,\n" +
    "  log text\n" +
    ");\n" +
    "\n" +
    "-- insert device logs\n" +
    "INSERT INTO device_logs (device_id, log)\n" +
    "SELECT s, 'device log:'||s FROM generate_series(0, 99) s;\n" +
    "\n" +
    "-- convert device_logs into a distributed table without interrupting the application\n" +
    "SELECT create_distributed_table_concurrently('device_logs', 'device_id', colocate_with := 'devices');\n" +
    "\n" +
    "\n" +
    "-- get the count of the logs, parallelized across shards\n" +
    "SELECT count(*) FROM device_logs;\n" +
    "\n" +
    "┌───────┐\n" +
    "│ count │\n" +
    "├───────┤\n" +
    "│   100 │\n" +
    "└───────┘\n" +
    "(1 row)\n" +
    "\n" +
    "Time: 48.734 ms\n" +
    "```\n" +
    "\n" +
    "\n" +
    "\n" +
    "### Creating Reference Tables\n" +
    "\n" +
    "When you need fast joins or foreign keys that do not include the distribution column, you can use `create_reference_table` to replicate a table across all nodes in the cluster.\n" +
    "\n" +
    "```sql\n" +
    "CREATE TABLE device_types (\n" +
    "  device_type_id int primary key,\n" +
    "  device_type_name text not null unique\n" +
    ");\n" +
    "\n" +
    "-- replicate the table across all nodes to enable foreign keys and joins on any column\n" +
    "SELECT create_reference_table('device_types');\n" +
    "\n" +
    "-- insert a device type\n" +
    "INSERT INTO device_types (device_type_id, device_type_name) VALUES (55, 'laptop');\n" +
    "\n" +
    "-- optionally: make sure the application can only insert devices with known types\n" +
    "ALTER TABLE devices ADD CONSTRAINT device_type_fk\n" +
    "FOREIGN KEY (device_type_id) REFERENCES device_types (device_type_id);\n" +
    "\n" +
    "-- get the last 3 events for devices whose type name starts with laptop, parallelized across shards\n" +
    "SELECT device_id, event_time, data->>'measurement' AS value, device_name, device_type_name\n" +
    "FROM events JOIN devices USING (device_id) JOIN device_types USING (device_type_id)\n" +
    "WHERE device_type_name LIKE 'laptop%' ORDER BY event_time DESC LIMIT 3;\n" +
    "\n" +
    "┌───────────┬───────────────────────────────┬─────────────────────┬─────────────┬──────────────────┐\n" +
    "│ device_id │          event_time           │        value        │ device_name │ device_type_name │\n" +
    "├───────────┼───────────────────────────────┼─────────────────────┼─────────────┼──────────────────┤\n" +
    "│        60 │ 2021-03-04 16:00:31.189963+00 │ 0.28902084163415864 │ device-60   │ laptop           │\n" +
    "│         8 │ 2021-03-04 16:00:31.189963+00 │ 0.8723803076285073  │ device-8    │ laptop           │\n" +
    "│        20 │ 2021-03-04 16:00:31.189963+00 │ 0.8177634801548557  │ device-20   │ laptop           │\n" +
    "└───────────┴───────────────────────────────┴─────────────────────┴─────────────┴──────────────────┘\n" +
    "(3 rows)\n" +
    "\n" +
    "Time: 146.063 ms\n" +
    "```\n" +
    "\n" +
    "Reference tables enable you to scale out complex data models and take full advantage of relational database features.\n" +
    "\n" +
    "### Creating Tables with Columnar Storage\n" +
    "\n" +
    "To use columnar storage in your PostgreSQL database, all you need to do is add `USING columnar` to your `CREATE TABLE` statements and your data will be automatically compressed using the columnar access method.\n" +
    "\n" +
    "```sql\n" +
    "CREATE TABLE events_columnar (\n" +
    "  device_id bigint,\n" +
    "  event_id bigserial,\n" +
    "  event_time timestamptz default now(),\n" +
    "  data jsonb not null\n" +
    ")\n" +
    "USING columnar;\n" +
    "\n" +
    "-- insert some data\n" +
    "INSERT INTO events_columnar (device_id, data)\n" +
    "SELECT d, '{\"hello\":\"columnar\"}' FROM generate_series(1,10000000) d;\n" +
    "\n" +
    "-- create a row-based table to compare\n" +
    "CREATE TABLE events_row AS SELECT * FROM events_columnar;\n" +
    "\n" +
    "-- see the huge size difference!\n" +
    "\\d+\n" +
    "                                          List of relations\n" +
    "┌────────┬──────────────────────────────┬──────────┬───────┬─────────────┬────────────┬─────────────┐\n" +
    "│ Schema │             Name             │   Type   │ Owner │ Persistence │    Size    │ Description │\n" +
    "├────────┼──────────────────────────────┼──────────┼───────┼─────────────┼────────────┼─────────────┤\n" +
    "│ public │ events_columnar              │ table    │ marco │ permanent   │ 25 MB      │             │\n" +
    "│ public │ events_row                   │ table    │ marco │ permanent   │ 651 MB     │             │\n" +
    "└────────┴──────────────────────────────┴──────────┴───────┴─────────────┴────────────┴─────────────┘\n" +
    "(2 rows)\n" +
    "```\n" +
    "\n" +
    "You can use columnar storage by itself, or in a distributed table to combine the benefits of compression and the distributed query engine.\n" +
    "\n" +
    "When using columnar storage, you should only load data in batch using `COPY` or `INSERT..SELECT` to achieve good  compression. Update, delete, and foreign keys are currently unsupported on columnar tables. However, you can use partitioned tables in which newer partitions use row-based storage, and older partitions are compressed using columnar storage.\n" +
    "\n" +
    "To learn more about columnar storage, check out the [columnar storage README](https://github.com/citusdata/citus/blob/master/src/backend/columnar/README.md).\n" +
    "\n" +
    "## Schema-based sharding\n" +
    "\n" +
    "Available since Citus 12.0, [schema-based sharding](https://docs.citusdata.com/en/stable/get_started/concepts.html#schema-based-sharding) is the shared database, separate schema model, the schema becomes the logical shard within the database. Multi-tenant apps can a use a schema per tenant to easily shard along the tenant dimension. Query changes are not required and the application usually only needs a small modification to set the proper search_path when switching tenants. Schema-based sharding is an ideal solution for microservices, and for ISVs deploying applications that cannot undergo the changes required to onboard row-based sharding.\n" +
    "\n" +
    "### Creating distributed schemas\n" +
    "\n" +
    "You can turn an existing schema into a distributed schema by calling `citus_schema_distribute`:\n" +
    "\n" +
    "```sql\n" +
    "SELECT citus_schema_distribute('user_service');\n" +
    "```\n" +
    "\n" +
    "Alternatively, you can set `citus.enable_schema_based_sharding` to have all newly created schemas be automatically converted into distributed schemas:\n" +
    "\n" +
    "```sql\n" +
    "SET citus.enable_schema_based_sharding TO ON;\n" +
    "\n" +
    "CREATE SCHEMA AUTHORIZATION user_service;\n" +
    "CREATE SCHEMA AUTHORIZATION time_service;\n" +
    "CREATE SCHEMA AUTHORIZATION ping_service;\n" +
    "```\n" +
    "\n" +
    "### Running queries\n" +
    "\n" +
    "Queries will be properly routed to schemas based on `search_path` or by explicitly using the schema name in the query.\n" +
    "\n" +
    "For [microservices](https://docs.citusdata.com/en/stable/get_started/tutorial_microservices.html) you would create a USER per service matching the schema name, hence the default `search_path` would contain the schema name. When connected the user queries would be automatically routed and no changes to the microservice would be required.\n" +
    "\n" +
    "```sql\n" +
    "CREATE USER user_service;\n" +
    "CREATE SCHEMA AUTHORIZATION user_service;\n" +
    "```\n" +
    "\n" +
    "For typical multi-tenant applications, you would set the search path to the tenant schema name in your application:\n" +
    "\n" +
    "```sql\n" +
    "SET search_path = tenant_name, public;\n" +
    "```\n" +
    "\n" +
    "## Setting up with High Availability\n" +
    "\n" +
    "One of the most popular high availability solutions for PostgreSQL, [Patroni 3.0](https://github.com/zalando/patroni), has [first class support for Citus 10.0 and above](https://patroni.readthedocs.io/en/latest/citus.html#citus), additionally since Citus 11.2 ships with improvements for smoother node switchover in Patroni.\n" +
    "\n" +
    "An example of patronictl list output for the Citus cluster:\n" +
    "\n" +
    "```bash\n" +
    "postgres@coord1:~$ patronictl list demo\n" +
    "```\n" +
    "\n" +
    "```text\n" +
    "+ Citus cluster: demo ----------+--------------+---------+----+-----------+\n" +
    "| Group | Member  | Host        | Role         | State   | TL | Lag in MB |\n" +
    "+-------+---------+-------------+--------------+---------+----+-----------+\n" +
    "|     0 | coord1  | 172.27.0.10 | Replica      | running |  1 |         0 |\n" +
    "|     0 | coord2  | 172.27.0.6  | Sync Standby | running |  1 |         0 |\n" +
    "|     0 | coord3  | 172.27.0.4  | Leader       | running |  1 |           |\n" +
    "|     1 | work1-1 | 172.27.0.8  | Sync Standby | running |  1 |         0 |\n" +
    "|     1 | work1-2 | 172.27.0.2  | Leader       | running |  1 |           |\n" +
    "|     2 | work2-1 | 172.27.0.5  | Sync Standby | running |  1 |         0 |\n" +
    "|     2 | work2-2 | 172.27.0.7  | Leader       | running |  1 |           |\n" +
    "+-------+---------+-------------+--------------+---------+----+-----------+\n" +
    "```\n" +
    "\n" +
    "## Documentation\n" +
    "\n" +
    "If you’re ready to get started with Citus or want to know more, we recommend reading the [Citus open source documentation](https://docs.citusdata.com/en/stable/). Or, if you are using Citus on Azure, then the [Azure Cosmos DB for PostgreSQL](https://learn.microsoft.com/azure/cosmos-db/postgresql/introduction) is the place to start.\n" +
    "\n" +
    "Our Citus docs contain comprehensive use case guides on how to build a [multi-tenant SaaS application](https://docs.citusdata.com/en/stable/use_cases/multi_tenant.html), [real-time analytics dashboard]( https://docs.citusdata.com/en/stable/use_cases/realtime_analytics.html), or work with [time series data](https://docs.citusdata.com/en/stable/use_cases/timeseries.html).\n" +
    "\n" +
    "## Architecture\n" +
    "\n" +
    "A Citus database cluster grows from a single PostgreSQL node into a cluster by adding worker nodes. In a Citus cluster, the original node to which the application connects is referred to as the coordinator node. The Citus coordinator contains both the metadata of distributed tables and reference tables, as well as regular (local) tables, sequences, and other database objects (e.g. foreign tables).\n" +
    "\n" +
    "Data in distributed tables is stored in “shards”, which are actually just regular PostgreSQL tables on the worker nodes. When querying a distributed table on the coordinator node, Citus will send regular SQL queries to the worker nodes. That way, all the usual PostgreSQL optimizations and extensions can automatically be used with Citus.\n" +
    "\n" +
    "\n" +
    "When you send a query in which all (co-located) distributed tables have the same filter on the distribution column, Citus will automatically detect that and send the whole query to the worker node that stores the data. That way, arbitrarily complex queries are supported with minimal routing overhead, which is especially useful for scaling transactional workloads. If queries do not have a specific filter, each shard is queried in parallel, which is especially useful in analytical workloads. The Citus distributed executor is adaptive and is designed to handle both query types at the same time on the same system under high concurrency, which enables large-scale mixed workloads.\n" +
    "\n" +
    "The schema and metadata of distributed tables and reference tables are automatically synchronized to all the nodes in the cluster. That way, you can connect to any node to run distributed queries. Schema changes and cluster administration still need to go through the coordinator.\n" +
    "\n" +
    "Detailed descriptions of the implementation for Citus developers are provided in the [Citus Technical Documentation](src/backend/distributed/README.md).\n" +
    "\n" +
    "## When to use Citus\n" +
    "\n" +
    "Citus is uniquely capable of scaling both analytical and transactional workloads with up to petabytes of data. Use cases in which Citus is commonly used:\n" +
    "\n" +
    "- **[Customer-facing analytics dashboards](http://docs.citusdata.com/en/stable/use_cases/realtime_analytics.html)**:\n" +
    "  Citus enables you to build analytics dashboards that simultaneously ingest and process large amounts of data in the database and give sub-second response times even with a large number of concurrent users.\n" +
    "\n" +
    "  The advanced parallel, distributed query engine in Citus combined with PostgreSQL features such as [array types](https://www.postgresql.org/docs/current/arrays.html), [JSONB](https://www.postgresql.org/docs/current/datatype-json.html), [lateral joins](https://heap.io/blog/engineering/postgresqls-powerful-new-join-type-lateral), and extensions like [HyperLogLog](https://github.com/citusdata/postgresql-hll) and [TopN](https://github.com/citusdata/postgresql-topn) allow you to build responsive analytics dashboards no matter how many customers or how much data you have.\n" +
    "\n" +
    "  Example real-time analytics users: [Algolia](https://www.citusdata.com/customers/algolia)\n" +
    "\n" +
    "- **[Time series data](http://docs.citusdata.com/en/stable/use_cases/timeseries.html)**:\n" +
    "  Citus enables you to process and analyze very large amounts of time series data. The biggest Citus clusters store well over a petabyte of time series data and ingest terabytes per day.\n" +
    "\n" +
    "  Citus integrates seamlessly with [Postgres table partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html) and has [built-in functions for partitioning by time](https://www.citusdata.com/blog/2021/10/22/how-to-scale-postgres-for-time-series-data-with-citus/), which can speed up queries and writes on time series tables. You can take advantage of Citus’s parallel, distributed query engine for fast analytical queries, and use the built-in *columnar storage* to compress old partitions.\n" +
    "\n" +
    "  Example users: [MixRank](https://www.citusdata.com/customers/mixrank)\n" +
    "\n" +
    "- **[Software-as-a-service (SaaS) applications](http://docs.citusdata.com/en/stable/use_cases/multi_tenant.html)**:\n" +
    "  SaaS and other multi-tenant applications need to be able to scale their database as the number of tenants/customers grows. Citus enables you to transparently shard a complex data model by the tenant dimension, so your database can grow along with your business.\n" +
    "\n" +
    "  By distributing tables along a tenant ID column and co-locating data for the same tenant, Citus can horizontally scale complex (tenant-scoped) queries, transactions, and foreign key graphs. Reference tables and distributed DDL commands make database management a breeze compared to manual sharding. On top of that, you have a built-in distributed query engine for doing cross-tenant analytics inside the database.\n" +
    "\n" +
    "  Example multi-tenant SaaS users: [Salesloft](https://fivetran.com/case-studies/replicating-sharded-databases-a-case-study-of-salesloft-citus-data-and-fivetran), [ConvertFlow](https://www.citusdata.com/customers/convertflow)\n" +
    "\n" +
    "- **[Microservices](https://docs.citusdata.com/en/stable/get_started/tutorial_microservices.html)**: Citus supports schema based sharding, which allows distributing regular database schemas across many machines. This sharding methodology fits nicely with typical Microservices architecture, where storage is fully owned by the service hence can’t share the same schema definition with other tenants. Citus allows distributing horizontally scalable state across services, solving one of the [main problems](https://stackoverflow.blog/2020/11/23/the-macro-problem-with-microservices/) of microservices.\n" +
    "\n" +
    "- **Geospatial**:\n" +
    "  Because of the powerful [PostGIS](https://postgis.net/) extension to Postgres that adds support for geographic objects into Postgres, many people run spatial/GIS applications on top of Postgres. And since spatial location information has become part of our daily life, well, there are more geospatial applications than ever. When your Postgres database needs to scale out to handle an increased workload, Citus is a good fit.\n" +
    "\n" +
    "  Example geospatial users: [Helsinki Regional Transportation Authority (HSL)](https://customers.microsoft.com/story/845146-transit-authority-improves-traffic-monitoring-with-azure-database-for-postgresql-hyperscale), [MobilityDB](https://www.citusdata.com/blog/2020/11/09/analyzing-gps-trajectories-at-scale-with-postgres-mobilitydb/).\n" +
    "\n" +
    "## Need Help?\n" +
    "\n" +
    "- **Slack**: Ask questions in our Citus community [Slack channel](https://slack.citusdata.com).\n" +
    "- **GitHub issues**: Please submit issues via [GitHub issues](https://github.com/citusdata/citus/issues).\n" +
    "- **Documentation**: Our [Citus docs](https://docs.citusdata.com ) have a wealth of resources, including sections on [query performance tuning](https://docs.citusdata.com/en/stable/performance/performance_tuning.html), [useful diagnostic queries](https://docs.citusdata.com/en/stable/admin_guide/diagnostic_queries.html), and [common error messages](https://docs.citusdata.com/en/stable/reference/common_errors.html).\n" +
    "- **Docs issues**: You can also submit documentation issues via [GitHub issues for our Citus docs](https://github.com/citusdata/citus_docs/issues).\n" +
    "- **Updates & Release Notes**: Learn about what's new in each Citus version on the [Citus Updates page](https://www.citusdata.com/updates/).\n" +
    "\n" +
    "## Contributing\n" +
    "\n" +
    "Citus is built on and of open source, and we welcome your contributions. The [CONTRIBUTING.md](CONTRIBUTING.md) file explains how to get started developing the Citus extension itself and our code quality guidelines.\n" +
    "\n" +
    "## Code of Conduct\n" +
    "\n" +
    "This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).\n" +
    "For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or\n" +
    "contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.\n" +
    "\n" +
    "## Stay Connected\n" +
    "\n" +
    "- **Twitter**: Follow us [@citusdata](https://twitter.com/citusdata) to track the latest posts & updates on what’s happening.\n" +
    "- **Citus Blog**: Read our popular [Citus Open Source Blog](https://www.citusdata.com/blog/) for posts about PostgreSQL and Citus.\n" +
    "- **Citus Newsletter**: Subscribe to our monthly technical [Citus Newsletter](https://www.citusdata.com/join-newsletter) to get a curated collection of our favorite posts, videos, docs, talks, & other Postgres goodies.\n" +
    "- **Slack**: Our [Citus Public slack](https://slack.citusdata.com/) is a good way to stay connected, not just with us but with other Citus users.\n" +
    "- **Sister Blog**: Read the PostgreSQL posts on the [Azure Cosmos DB for PostgreSQL blog](https://devblogs.microsoft.com/cosmosdb/category/postgresql/) about our managed service on Azure.\n" +
    "- **Videos**: Check out this [YouTube playlist](https://www.youtube.com/playlist?list=PLixnExCn6lRq261O0iwo4ClYxHpM9qfVy) of some of our favorite Citus videos and demos. If you want to deep dive into how Citus extends PostgreSQL, you might want to check out Marco Slot’s talk at Carnegie Mellon titled [Citus: Distributed PostgreSQL as an Extension](https://youtu.be/X-aAgXJZRqM) that was part of Andy Pavlo’s Vaccination Database Talks series at CMUDB.\n" +
    "- **Our other Postgres projects**: Our team also works on other awesome PostgreSQL open source extensions & projects, including: [pg_cron](https://github.com/citusdata/pg_cron), [HyperLogLog](https://github.com/citusdata/postgresql-hll), [TopN](https://github.com/citusdata/postgresql-topn), [pg_auto_failover](https://github.com/citusdata/pg_auto_failover), [activerecord-multi-tenant](https://github.com/citusdata/activerecord-multi-tenant), and [django-multitenant](https://github.com/citusdata/django-multitenant).\n" +
    "\n" +
    "___\n" +
    "\n" +
    "Copyright © Citus Data, Inc.";

export {sampleMarkdown}
