DECLARE KEYWORD in Models Says That
Declare is used to tell the compiler that this thing usually a variable exists already and we are just declaring it here. It is used to avoid compilation errors when we are sure that the variable will be available at runtime, but the compiler cannot verify it. In the context of Sequelize models, we use declare to indicate that certain properties will be present on the model instances, even though they are not defined in the class itself. This is especially useful when using TypeScript with Sequelize, as it helps to ensure type safety while working with model instances.

soft delete is a technique where instead of permanently deleting a record from the database, we mark it as deleted by setting a flag or a timestamp. This allows us to keep the data in the database while still treating it as deleted in our application logic. In Sequelize, we can implement soft delete by adding a deletedAt column to our model and using the paranoid option. When paranoid is set to true, Sequelize will automatically exclude records with a non-null deletedAt value from query results, effectively treating them as deleted without actually removing them from the database.

## paranoid option in Sequelize
The paranoid option in Sequelize is used to enable soft deletes for a model. When you set paranoid: true in your model definition, Sequelize will add a deletedAt column to your table. Instead of permanently deleting records when you call the destroy method, Sequelize will set the deletedAt column to the current timestamp. This way, the record is not actually removed from the database, but it is treated as deleted in your application logic. When you query the model, Sequelize will automatically exclude records with a non-null deletedAt value, allowing you to work with only the active records while still keeping the deleted records in the database for potential recovery or auditing purposes.

??It is also Known as TOMBSTONE in some databases.
## TOMBSTONE in databases
Tombstone is a term used in databases to refer to a marker that indicates that a record has been deleted. When a record is deleted, instead of removing it from the database, a tombstone is created to indicate that the record has been marked as deleted. This allows the database to keep track of deleted records without actually removing them, which can be useful for auditing purposes or for recovering deleted data if needed. In some databases, tombstones are implemented as a special column or flag that is set when a record is deleted, while in others, they may be implemented as a separate table that tracks deleted records.

# 🚀 System Design Basics: DB Scaling, Load Balancer, Microservices

---

# 🧠 1. Database Scaling

## 👉 What is DB Scaling?

Database scaling is the process of handling more users and data efficiently without slowing down performance.

---

## 🔹 Vertical Scaling (Scale Up)

Increase the power of a single database server.

* Add more RAM
* Faster CPU
* Better storage (SSD)

### Example:

Users → Backend → One Powerful Database

✔ Simple to implement
❌ Limited by hardware

---

## 🔹 Horizontal Scaling (Scale Out)

Add multiple database servers.

### a) Read Replicas (Read Scaling)

* One Main DB (handles writes)
* Multiple Replica DBs (handle reads)

### Example:

Users → Backend → Main DB (write)
→ Replica1 (read)
→ Replica2 (read)

✔ Improves read performance

---

### b) Sharding (Write Scaling)

Split data across multiple databases.

### Example:

Users → Backend → DB1 (Users 1–1000)
DB2 (Users 1001–2000)

✔ Handles large datasets
❌ Complex to manage

---

# 🚦 2. Load Balancer

## 👉 What is a Load Balancer?

A load balancer distributes incoming traffic across multiple servers.

---

## Without Load Balancer

Users → Server1 (Overloaded)

❌ Single point of failure

---

## With Load Balancer

Users → Load Balancer → Server1
→ Server2
→ Server3

✔ High availability
✔ Better performance

---

## 🔹 Load Balancing Algorithms

* Round Robin
* Least Connections
* IP Hash

---

# 🌍 Real-World Flow

Client → Load Balancer → Backend Servers → Database

---

# 🧠 3. Microservices Architecture

## 👉 What are Microservices?

Microservices break a large application into small, independent services.

---

## ❌ Monolithic Architecture

Client → One Big Server → One Database

Problems:

* Hard to scale
* Hard to maintain
* Single point of failure

---

## ✅ Microservices Architecture

Client → API Gateway → Multiple Services

---

## 🧩 Example: E-commerce System

Client
↓
API Gateway
↓

* User Service
* Product Service
* Order Service
* Payment Service

Each service:

* Has its own database
* Can be deployed independently

---

## 🔄 Request Flow

1. Client sends request
2. API Gateway routes request
3. Service processes request
4. Services may communicate with each other

---

## 🔗 Service Communication

### 1. Synchronous (HTTP APIs)

Order Service → User Service

### 2. Asynchronous (Event-based)

Order Created → Queue → Payment Service

---

# 🔥 Combined Architecture

Clients
↓
Load Balancer
↓
API Gateway
↓
Microservices
↓
Databases (Scaled)

---

# ⚡ Benefits

* Scalability
* Fault isolation
* Faster development
* Independent deployment

---

# ❌ Challenges

* Complex architecture
* Hard debugging
* Requires DevOps (Docker, Kubernetes)

---

# 💡 When to Use What?

| Problem           | Solution      |
| ----------------- | ------------- |
| Server overload   | Load Balancer |
| Slow DB reads     | Read Replicas |
| Large data        | Sharding      |
| Large application | Microservices |

---

# 🧑‍💻 Example (Node.js Structure)

* auth-service
* product-service
* order-service
* payment-service

Each service:

* Express server
* Separate database

---

# 🏁 Summary

* DB Scaling → Handles data growth
* Load Balancer → Distributes traffic
* Microservices → Splits application into services

---

🔥 This is the foundation of modern backend system design.


```A microservice is an architectural style where an application is built as a collection of small, independent services, instead of one big system.
Each service is responsible for a specific functionality and can be developed, deployed, and scaled independently. This approach allows for greater flexibility, easier maintenance, and faster development cycles compared to traditional monolithic architectures. In a microservices architecture, services communicate with each other through APIs, and each service typically has its own database to ensure loose coupling and data isolation.```


# API Gateway: 
is a server that acts as an API front-end, receiving API requests, enforcing throttling and security policies, passing requests to the back-end service, and then passing the response back to the requester. It serves as a single entry point for all clients, allowing for better management of API traffic and providing features such as load balancing, authentication, and request routing. An API Gateway can also handle cross-cutting concerns like logging, monitoring, and rate limiting, making it an essential component in a microservices architecture.

Basically API Gateway is a server that acts as an entry point for all client requests to the backend services in a microservices architecture. It handles tasks such as routing, authentication, and load balancing, allowing for better management of API traffic and providing a single point of access for clients.

Api GAteway : Handles Authentication, Routing, Load Balancing, Throttling, Logging, Monitoring, Rate Limiting.

//Now Redis Cache Between DB and DB request
Write back  cache and write through cachhe and write around cache

# Caching Strategies
1. Write-Through Cache: In this strategy, data is written to the cache and the database simultaneously. When a write operation occurs, the data is first written to the cache, and then it is written to the database. This ensures that the cache always has the most up-to-date data, but it can introduce latency since both operations need to complete before the write is considered successful.
2. Write-Back Cache: In this strategy, data is written to the cache first, and the write operation is considered successful immediately. The data is then asynchronously written to the database at a later time. This can improve performance since the write operation is faster, but it introduces a risk of data loss if the cache fails before the data is written to the database.
3. Write-Around Cache: In this strategy, data is written directly to the database, bypassing the cache. The cache is only updated when a read operation occurs. This can help to reduce cache pollution from write-heavy workloads, but it may lead to stale data in the cache if the database is updated frequently without corresponding reads.

//Instead of Cache we can use Indexing in DB For faster Data Retrieval
# Indexing in Databases
Indexing is a technique used in databases to improve the speed of data retrieval operations. An index is a data structure that allows the database to quickly locate and access the desired data without having to scan the entire table. When an index is created on a column or a set of columns, the database creates a separate data structure that contains the values of those columns along with pointers to the corresponding rows in the table. This allows for faster query execution, especially for large datasets, as the database can use the index to quickly find the relevant rows instead of performing a full table scan. However, it is important to note that while indexing can significantly improve read performance, it can also introduce overhead for write operations, as the index needs to be updated whenever data is inserted, updated, or deleted.

# Elastic Search for full text search
Elastic Search is a powerful search engine that is commonly used for full-text search and analytics. It is built on top of the Apache Lucene library and provides a distributed, scalable, and real-time search solution. Elastic Search allows you to index and search large volumes of data quickly and efficiently. It supports a wide range of search features, including full-text search, filtering, aggregation, and geospatial search. Elastic Search is often used in applications that require advanced search capabilities, such as e-commerce platforms, content management systems, and log analysis tools. It can be integrated with various programming languages and frameworks, making it a popular choice for developers looking to implement powerful search functionality in their applications.