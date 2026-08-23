# Project Structure & Architecture Guidelines
**Project Name:** CrowdShield: AI-Powered Multi-Source Early Warning and Decision Support System for Large Public Events
**Document Version:** 1.0

> **Authoritative Source:** For the complete 63-section system specification, see [`00_MASTER_SPEC.md`](./00_MASTER_SPEC.md).
> **AI Agent Rules:** See [`10_AI_AGENT_INSTRUCTIONS.md`](./10_AI_AGENT_INSTRUCTIONS.md).

---

## 1. Architecture Pattern

CrowdShield uses a **Hybrid Architecture** combining:

| Pattern | Purpose |
| :--- | :--- |
| **Clean Architecture** | Domain layer at core, dependencies point inward |
| **SOLID Principles** | Each feature module follows SRP, OCP, LSP, ISP, DIP |
| **Feature-Based** | Code organized by business capability, not technical layer |
| **Event-Driven** | Domain events for loose coupling, async communication |
| **Microservices-Ready** | Modular monolith today, can split into services tomorrow |

### 1.1 Core Architectural Principles

```
PRINCIPLE 1 — DOMAIN INDEPENDENCE
  The Domain layer has ZERO external dependencies.
  No imports from FastAPI, SQLAlchemy, Redis, or any framework.
  Domain code must be pure Python with no third-party packages.

PRINCIPLE 2 — DEPENDENCY DIRECTION
  Dependencies always point INWARD toward Domain.
  Presentation → Application → Domain ← Infrastructure
  Infrastructure IMPLEMENTS interfaces defined in Domain.

PRINCIPLE 3 — FEATURE ISOLATION
  Each feature module is self-contained.
  Features communicate ONLY through domain events, NOT direct imports.
  Feature A never imports from Feature B.

PRINCIPLE 4 — EVENT-DRIVEN COUPLING
  When Feature A needs to notify Feature B, it publishes a domain event.
  Feature B subscribes to that event and reacts.
  This keeps features decoupled and testable.

PRINCIPLE 5 — INFRASTRUCTURE IS REPLACEABLE
  Database can be swapped (PostgreSQL → MongoDB) by changing only infrastructure layer.
  AI model can be swapped (YOLOv8 → YOLOv9) by changing only the adapter.
  Domain and Application layers remain untouched.
```

### 1.2 SOLID Principles Applied

| Principle | CrowdShield Implementation |
| :--- | :--- |
| **SRP** | Each use case handles ONE business action (`CreateEvent`, `PredictRisk`, etc.) |
| **OCP** | New data sources (Drone, BLE) added via new adapter, no Fusion Hub changes |
| **LSP** | All adapters implement same interface, are interchangeable in Fusion pipeline |
| **ISP** | Separate interfaces: `IDataSource`, `IRiskPredictor`, `IFusionEngine` |
| **DIP** | Domain depends on abstractions (interfaces), infrastructure implements them |

### 1.3 Dependency Flow

```
PRESENTATION (API Routes / React Components)
        │
        ▼
APPLICATION (Use Cases / Services)
        │
        ▼
DOMAIN (Entities / Interfaces / Events)  ◄──── INFRASTRUCTURE (DB / Adapters / Engines)
        ▲                                        │
        │                                        │
        └──── implements interfaces defined ─────┘
```

---

## 2. Directory Structure

```
crowdcatchup/
│
├── apps/
│   ├── web/                                    # PRESENTATION LAYER (Frontend)
│   │   └── src/
│   │       ├── app/                            # Next.js App Router (routes only)
│   │       │   ├── (auth)/                     # Auth route group
│   │       │   │   ├── login/page.tsx
│   │       │   │   └── register/page.tsx
│   │       │   ├── (dashboard)/                # Protected dashboard routes
│   │       │   │   ├── authority/page.tsx
│   │       │   │   ├── police/page.tsx
│   │       │   │   ├── citizen/page.tsx
│   │       │   │   └── event-owner/page.tsx
│   │       │   ├── layout.tsx                  # Root layout
│   │       │   └── page.tsx                    # Landing/redirect
│   │       │
│   │       ├── features/                       # FEATURE-BASED frontend
│   │       │   ├── auth/                       # Auth feature
│   │       │   │   ├── components/             # UI components
│   │       │   │   │   ├── LoginForm.tsx
│   │       │   │   │   └── RegisterForm.tsx
│   │       │   │   ├── hooks/                  # React hooks
│   │       │   │   │   └── useAuth.ts
│   │       │   │   ├── api/                    # API client
│   │       │   │   │   └── auth-client.ts
│   │       │   │   └── types/                  # Feature types
│   │       │   │       └── auth.ts
│   │       │   │
│   │       │   ├── map/                        # Map feature
│   │       │   │   ├── components/
│   │       │   │   │   ├── EventMap.tsx
│   │       │   │   │   ├── ZoneLayer.tsx
│   │       │   │   │   ├── GateLayer.tsx
│   │       │   │   │   ├── RouteLayer.tsx
│   │       │   │   │   ├── HeatmapLayer.tsx
│   │       │   │   │   └── CrowdOverlay.tsx
│   │       │   │   ├── hooks/
│   │       │   │   │   ├── useMapEngine.ts
│   │       │   │   │   └── useMapLayers.ts
│   │       │   │   └── utils/
│   │       │   │       └── geo-utils.ts
│   │       │   │
│   │       │   ├── crowd-monitoring/           # Crowd monitoring feature
│   │       │   │   ├── components/
│   │       │   │   │   ├── RiskPanel.tsx
│   │       │   │   │   ├── CrowdMetrics.tsx
│   │       │   │   │   ├── SourceHealthPanel.tsx
│   │       │   │   │   └── ZoneStatusCard.tsx
│   │       │   │   └── hooks/
│   │       │   │       ├── useCrowdState.ts
│   │       │   │       └── useRiskUpdates.ts
│   │       │   │
│   │       │   ├── recommendations/            # Recommendations feature
│   │       │   │   ├── components/
│   │       │   │   │   ├── RecommendationCard.tsx
│   │       │   │   │   ├── InterventionApproval.tsx
│   │       │   │   │   └── ExplanationPanel.tsx
│   │       │   │   └── hooks/
│   │       │   │       └── useRecommendations.ts
│   │       │   │
│   │       │   └── event-configuration/        # Event config feature
│   │       │       ├── components/
│   │       │       │   ├── VenueBuilder.tsx
│   │       │       │   ├── ZoneEditor.tsx
│   │       │       │   ├── GateEditor.tsx
│   │       │       │   ├── RouteEditor.tsx
│   │       │       │   └── SmartGateConfig.tsx
│   │       │       └── hooks/
│   │       │           └── useEventConfig.ts
│   │       │
│   │       ├── shared/                         # SHARED frontend code
│   │       │   ├── components/
│   │       │   │   ├── ui/                     # shadcn/ui primitives
│   │       │   │   ├── layout/
│   │       │   │   │   ├── Header.tsx
│   │       │   │   │   ├── Sidebar.tsx
│   │       │   │   │   └── DashboardLayout.tsx
│   │       │   │   └── alerts/
│   │       │   │       └── AlertBanner.tsx
│   │       │   ├── hooks/
│   │       │   │   └── useWebSocket.ts
│   │       │   └── lib/
│   │       │       ├── api-client.ts
│   │       │       ├── ws-client.ts
│   │       │       └── config.ts
│   │       │
│   │       ├── stores/                         # Zustand state
│   │       │   ├── auth-store.ts
│   │       │   ├── event-store.ts
│   │       │   └── ui-store.ts
│   │       │
│   │       └── types/                          # Global types
│   │           ├── api.ts
│   │           └── models.ts
│   │
│   └── api/                                    # BACKEND (Modular Monolith)
│       ├── main.py                             # Thin entry point
│       │
│       ├── core/                               # CORE (framework config)
│       │   ├── __init__.py
│       │   ├── config.py
│       │   ├── database.py
│       │   ├── redis.py
│       │   ├── security.py
│       │   ├── events.py                       # In-process event bus
│       │   └── dependencies.py
│       │
│       ├── shared/                             # SHARED KERNEL
│       │   ├── __init__.py
│       │   ├── domain/
│       │   │   ├── __init__.py
│       │   │   ├── base_entity.py
│       │   │   ├── base_value_object.py
│       │   │   ├── base_domain_event.py
│       │   │   └── base_repository.py
│       │   ├── infrastructure/
│       │   │   ├── __init__.py
│       │   │   ├── event_bus.py
│       │   │   ├── websocket_manager.py
│       │   │   └── exceptions.py
│       │   └── api/
│       │       ├── __init__.py
│       │       ├── dependencies.py
│       │       └── error_handlers.py
│       │
│       ├── features/                           # FEATURE MODULES
│       │   ├── auth/                           # Auth feature
│       │   │   ├── __init__.py
│       │   │   ├── domain/
│       │   │   │   ├── __init__.py
│       │   │   │   ├── entities/
│       │   │   │   │   ├── __init__.py
│       │   │   │   │   └── user.py
│       │   │   │   ├── value_objects/
│       │   │   │   │   ├── __init__.py
│       │   │   │   │   ├── email.py
│       │   │   │   │   └── password.py
│       │   │   │   ├── enums/
│       │   │   │   │   ├── __init__.py
│       │   │   │   │   └── role.py
│       │   │   │   └── exceptions/
│       │   │   │       ├── __init__.py
│       │   │   │       └── auth_error.py
│       │   │   ├── application/
│       │   │   │   ├── __init__.py
│       │   │   │   ├── use_cases/
│       │   │   │   │   ├── __init__.py
│       │   │   │   │   ├── login.py
│       │   │   │   │   ├── register.py
│       │   │   │   │   └── get_current_user.py
│       │   │   │   └── dto/
│       │   │   │       ├── __init__.py
│       │   │   │       └── user_dto.py
│       │   │   ├── infrastructure/
│       │   │   │   ├── __init__.py
│       │   │   │   ├── repositories/
│       │   │   │   │   ├── __init__.py
│       │   │   │   │   └── user_repository_impl.py
│       │   │   │   └── models/
│       │   │   │       ├── __init__.py
│       │   │   │       └── user_model.py
│       │   │   └── api/
│       │   │       ├── __init__.py
│       │   │       ├── routes.py
│       │   │       └── schemas.py
│       │   │
│       │   ├── events/                         # Events feature
│       │   │   ├── domain/
│       │   │   │   ├── entities/
│       │   │   │   │   ├── event.py
│       │   │   │   │   ├── zone.py
│       │   │   │   │   ├── gate.py
│       │   │   │   │   └── route.py
│       │   │   │   ├── value_objects/
│       │   │   │   │   ├── geo_point.py
│       │   │   │   │   ├── geo_polygon.py
│       │   │   │   │   └── date_range.py
│       │   │   │   ├── enums/
│       │   │   │   │   ├── event_status.py
│       │   │   │   │   └── gate_status.py
│       │   │   │   ├── events/
│       │   │   │   │   ├── event_created.py
│       │   │   │   │   └── event_status_changed.py
│       │   │   │   └── exceptions/
│       │   │   │       └── event_error.py
│       │   │   ├── application/
│       │   │   │   ├── use_cases/
│       │   │   │   │   ├── create_event.py
│       │   │   │   │   ├── update_event.py
│       │   │   │   │   ├── get_event.py
│       │   │   │   │   ├── list_events.py
│       │   │   │   │   ├── change_event_status.py
│       │   │   │   │   ├── create_zone.py
│       │   │   │   │   ├── create_gate.py
│       │   │   │   │   └── create_route.py
│       │   │   │   ├── services/
│       │   │   │   │   └── event_service.py
│       │   │   │   └── dto/
│       │   │   │       ├── event_dto.py
│       │   │   │       ├── zone_dto.py
│       │   │   │       ├── gate_dto.py
│       │   │   │       └── route_dto.py
│       │   │   ├── infrastructure/
│       │   │   │   ├── repositories/
│       │   │   │   │   ├── event_repository_impl.py
│       │   │   │   │   ├── zone_repository_impl.py
│       │   │   │   │   └── gate_repository_impl.py
│       │   │   │   └── models/
│       │   │   │       ├── event_model.py
│       │   │   │       ├── zone_model.py
│       │   │   │       └── gate_model.py
│       │   │   └── api/
│       │   │       ├── routes.py
│       │   │       └── schemas.py
│       │   │
│       │   ├── fusion/                         # Fusion Hub feature
│       │   │   ├── domain/
│       │   │   │   ├── entities/
│       │   │   │   │   ├── observation.py
│       │   │   │   │   └── crowd_state.py
│       │   │   │   ├── interfaces/
│       │   │   │   │   ├── i_data_source.py
│       │   │   │   │   └── i_fusion_engine.py
│       │   │   │   ├── enums/
│       │   │   │   │   ├── source_type.py
│       │   │   │   │   └── source_health.py
│       │   │   │   └── events/
│       │   │   │       ├── observation_received.py
│       │   │   │       └── crowd_state_updated.py
│       │   │   ├── application/
│       │   │   │   ├── use_cases/
│       │   │   │   │   ├── ingest_observation.py
│       │   │   │   │   ├── fuse_crowd_state.py
│       │   │   │   │   └── detect_disagreement.py
│       │   │   │   └── services/
│       │   │   │       └── fusion_service.py
│       │   │   ├── infrastructure/
│       │   │   │   ├── adapters/
│       │   │   │   │   ├── cctv_adapter.py
│       │   │   │   │   ├── smart_gate_adapter.py
│       │   │   │   │   ├── gps_adapter.py
│       │   │   │   │   ├── drone_adapter.py
│       │   │   │   │   ├── telecom_adapter.py
│       │   │   │   │   ├── ble_adapter.py
│       │   │   │   │   └── synthetic_adapter.py
│       │   │   │   ├── engines/
│       │   │   │   │   ├── fusion_engine.py
│       │   │   │   │   └── confidence_engine.py
│       │   │   │   └── repositories/
│       │   │   │       └── observation_repository_impl.py
│       │   │   └── api/
│       │   │       ├── routes.py
│       │   │       └── schemas.py
│       │   │
│       │   ├── risk/                           # Risk Engine feature
│       │   │   ├── domain/
│       │   │   │   ├── entities/
│       │   │   │   │   └── risk_score.py
│       │   │   │   ├── interfaces/
│       │   │   │   │   └── i_risk_predictor.py
│       │   │   │   ├── enums/
│       │   │   │   │   └── risk_level.py
│       │   │   │   └── events/
│       │   │   │       └── risk_level_changed.py
│       │   │   ├── application/
│       │   │   │   ├── use_cases/
│       │   │   │   │   ├── predict_risk.py
│       │   │   │   │   └── assess_zone_risk.py
│       │   │   │   └── services/
│       │   │   │       └── risk_service.py
│       │   │   ├── infrastructure/
│       │   │   │   ├── predictors/
│       │   │   │   │   └── xgboost_predictor.py
│       │   │   │   └── repositories/
│       │   │   │       └── risk_repository_impl.py
│       │   │   └── api/
│       │   │       ├── routes.py
│       │   │       └── schemas.py
│       │   │
│       │   ├── recommendations/                # Decision Engine feature
│       │   │   ├── domain/
│       │   │   │   ├── entities/
│       │   │   │   │   └── recommendation.py
│       │   │   │   ├── enums/
│       │   │   │   │   └── intervention_type.py
│       │   │   │   ├── events/
│       │   │   │   │   └── intervention_approved.py
│       │   │   │   └── exceptions/
│       │   │   │       └── recommendation_error.py
│       │   │   ├── application/
│       │   │   │   ├── use_cases/
│       │   │   │   │   ├── generate_recommendation.py
│       │   │   │   │   └── approve_intervention.py
│       │   │   │   └── services/
│       │   │   │       └── decision_service.py
│       │   │   ├── infrastructure/
│       │   │   │   ├── engines/
│       │   │   │   │   └── decision_engine.py
│       │   │   │   └── repositories/
│       │   │   │       └── recommendation_repository_impl.py
│       │   │   └── api/
│       │   │       ├── routes.py
│       │   │       └── schemas.py
│       │   │
│       │   └── incidents/                      # Incident feature
│       │       ├── domain/
│       │       │   ├── entities/
│       │       │   │   └── incident.py
│       │       │   └── events/
│       │       │       └── incident_created.py
│       │       ├── application/
│       │       │   └── use_cases/
│       │       │       ├── create_incident.py
│       │       │       └── resolve_incident.py
│       │       ├── infrastructure/
│       │       │   └── repositories/
│       │       │       └── incident_repository_impl.py
│       │       └── api/
│       │           ├── routes.py
│       │           └── schemas.py
│       │
│       ├── api/                                # API AGGREGATION
│       │   ├── __init__.py
│       │   ├── v1/
│       │   │   ├── __init__.py
│       │   │   ├── router.py
│       │   │   └── websockets.py
│       │   └── middleware/
│       │       ├── __init__.py
│       │       ├── auth_middleware.py
│       │       └── logging_middleware.py
│       │
│       ├── tests/                              # TEST SUITE
│       │   ├── __init__.py
│       │   ├── conftest.py
│       │   ├── unit/
│       │   │   ├── domain/
│       │   │   ├── application/
│       │   │   └── infrastructure/
│       │   ├── integration/
│       │   └── e2e/
│       │
│       └── requirements.txt
│
├── ai/                                         # AI/ML PIPELINE
│   ├── requirements.txt
│   ├── domain/
│   │   ├── interfaces/
│   │   │   ├── i_detector.py
│   │   │   ├── i_tracker.py
│   │   │   └── i_risk_predictor.py
│   │   └── entities/
│   │       └── detection.py
│   ├── pipelines/
│   │   ├── cv_pipeline.py
│   │   ├── analytics_pipeline.py
│   │   ├── risk_pipeline.py
│   │   └── feature_pipeline.py
│   ├── adapters/
│   │   ├── yolo_detector.py
│   │   ├── bot_sort_tracker.py
│   │   └── xgboost_predictor.py
│   └── tests/
│
├── packages/                                   # SHARED PACKAGES
│   ├── types/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── observation.ts
│   │   │   ├── crowd-state.ts
│   │   │   ├── risk.ts
│   │   │   ├── event.ts
│   │   │   └── websocket-events.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/
│       ├── eslint/
│       └── typescript/
│
├── docs/                                       # DOCUMENTATION
├── README.md
└── package.json                                # Root workspace config
```

---

## 3. Layer Rules

### 3.1 Domain Layer (`features/{feature}/domain/`)

```
PURPOSE:
  Contains business logic, entities, and business rules.
  This is the INNERMOST layer with ZERO external dependencies.

RULES:
1. ZERO external dependencies (no FastAPI, SQLAlchemy, Redis, etc.)
2. Contains ONLY business logic and business data
3. Never imports from Application, Infrastructure, or Presentation layers
4. All classes are pure Python
5. Entities have identity (id field)
6. Value objects are immutable and compared by value
7. Enums define valid states/options
8. Domain events capture business occurrences
9. Interfaces (abstract base classes) define contracts for infrastructure
10. Exceptions represent business rule violations

ALLOWED IMPORTS:
- Python standard library only
- shared/domain/ (base classes)
- Other domain modules within SAME feature only

FORBIDDEN IMPORTS:
- fastapi, sqlalchemy, redis, pydantic (frameworks)
- features/{other_feature}/ (other features)
- infrastructure/, application/, api/ (other layers)
```

### 3.2 Application Layer (`features/{feature}/application/`)

```
PURPOSE:
  Contains use cases that orchestrate domain entities and infrastructure.
  Each use case represents ONE business action.

RULES:
1. Contains use cases (one per business action)
2. Orchestrates domain entities and infrastructure interfaces
3. Does NOT contain business logic (that lives in domain)
4. Does NOT know about database, HTTP, or frameworks
5. Uses interfaces from domain/infrastructure (DIP)
6. DTOs are simple data containers for transferring data

ALLOWED IMPORTS:
- domain/ (same feature)
- shared/domain/ (base classes)
- Interfaces from domain/interfaces/

FORBIDDEN IMPORTS:
- infrastructure/ (concrete implementations)
- fastapi, sqlalchemy, redis (frameworks)
- features/{other_feature}/ (other features)
```

### 3.3 Infrastructure Layer (`features/{feature}/infrastructure/`)

```
PURPOSE:
  Implements interfaces defined in domain.
  Contains all external integrations (DB, Redis, APIs, hardware).

RULES:
1. Implements interfaces defined in domain/
2. Contains all external integrations
3. Repository implementations use SQLAlchemy/Redis
4. Adapters convert external data to domain entities
5. Engines perform complex calculations
6. DB models map domain entities to database tables

ALLOWED IMPORTS:
- domain/ (same feature)
- application/ (for DTOs if needed)
- shared/ (base classes, event bus)
- fastapi, sqlalchemy, redis, pydantic (frameworks)
- opencv, ultralytics, xgboost (AI libraries)

FORBIDDEN IMPORTS:
- features/{other_feature}/ (other features — use events instead)
```

### 3.4 Presentation Layer (`features/{feature}/api/` + `apps/web/src/`)

```
BACKEND RULES:
1. Routes are thin — delegate to use cases immediately
2. Schemas handle request/response validation (Pydantic)
3. No business logic in routes
4. Use dependency injection for use cases
5. Return proper HTTP status codes

FRONTEND RULES:
1. Components are pure UI — delegate to hooks for logic
2. Hooks subscribe to stores and WebSocket
3. API clients make HTTP calls to backend
4. Features are self-contained (components, hooks, api, types)
5. Shared components are reusable across features
6. No business logic in components (that lives in backend)
```

---

## 4. Feature Module Rules

### 4.1 Internal Structure

Each feature module MUST have this exact internal structure:

```
features/{feature}/
├── __init__.py
├── domain/
│   ├── __init__.py
│   ├── entities/           # Business entities
│   ├── value_objects/      # Immutable value types
│   ├── enums/              # Valid states/options
│   ├── interfaces/         # Abstract contracts (for adapters)
│   ├── events/             # Domain events
│   └── exceptions/         # Business errors
├── application/
│   ├── __init__.py
│   ├── use_cases/          # One class per business action
│   ├── services/           # Orchestration logic
│   └── dto/                # Data transfer objects
├── infrastructure/
│   ├── __init__.py
│   ├── repositories/       # Database implementations
│   ├── adapters/           # External system adapters
│   ├── engines/            # Calculation engines
│   └── models/             # Database table models
└── api/
    ├── __init__.py
    ├── routes.py           # FastAPI route handlers
    └── schemas.py          # Pydantic request/response schemas
```

### 4.2 Feature Communication

```
RULES:
- Features communicate ONLY through domain events
- Feature A publishes event → Event Bus → Feature B subscribes
- NEVER import directly from another feature module

EXAMPLE:
  Fusion feature publishes CrowdStateUpdated event
  Risk feature subscribes and predicts risk
  Decision feature subscribes and generates recommendation
```

### 4.3 Feature Boundaries

```
RULES:
- Each feature owns its own database tables
- Each feature has its own repository interface
- Each feature has its own API routes
- No shared database tables between features (except auth/users)
- Feature modules can be extracted into microservices later
```

---

## 5. File Placement Rules

| Code Type | Location | Naming Pattern | Example |
| :--- | :--- | :--- | :--- |
| **Domain Entity** | `features/{f}/domain/entities/` | `{name}.py` | `event.py` |
| **Value Object** | `features/{f}/domain/value_objects/` | `{name}.py` | `geo_point.py` |
| **Enum** | `features/{f}/domain/enums/` | `{name}.py` | `event_status.py` |
| **Domain Event** | `features/{f}/domain/events/` | `{past_tense}.py` | `event_created.py` |
| **Interface** | `features/{f}/domain/interfaces/` | `i_{name}.py` | `i_data_source.py` |
| **Exception** | `features/{f}/domain/exceptions/` | `{name}_error.py` | `event_error.py` |
| **Use Case** | `features/{f}/application/use_cases/` | `{verb}_{noun}.py` | `create_event.py` |
| **App Service** | `features/{f}/application/services/` | `{name}_service.py` | `fusion_service.py` |
| **DTO** | `features/{f}/application/dto/` | `{name}_dto.py` | `event_dto.py` |
| **Repository Impl** | `features/{f}/infrastructure/repositories/` | `{name}_repository_impl.py` | `event_repository_impl.py` |
| **DB Model** | `features/{f}/infrastructure/models/` | `{name}_model.py` | `event_model.py` |
| **Adapter** | `features/{f}/infrastructure/adapters/` | `{name}_adapter.py` | `cctv_adapter.py` |
| **Engine** | `features/{f}/infrastructure/engines/` | `{name}_engine.py` | `fusion_engine.py` |
| **API Route** | `features/{f}/api/` | `routes.py` | routes for that feature |
| **Pydantic Schema** | `features/{f}/api/` | `schemas.py` | request/response schemas |
| **Migration** | `features/{f}/infrastructure/models/migrations/` | `{timestamp}_{desc}.py` | `001_create_events.py` |
| **Unit Test** | `tests/unit/features/{f}/` | mirrors feature structure | mirrors feature structure |
| **React Component** | `apps/web/src/features/{f}/components/` | `{Name}.tsx` | `EventMap.tsx` |
| **React Hook** | `apps/web/src/features/{f}/hooks/` | `use{Name}.ts` | `useCrowdState.ts` |
| **API Client** | `apps/web/src/features/{f}/api/` | `{name}-client.ts` | `auth-client.ts` |
| **Feature Type** | `apps/web/src/features/{f}/types/` | `{name}.ts` | `auth.ts` |
| **Zustand Store** | `apps/web/src/stores/` | `{name}-store.ts` | `auth-store.ts` |
| **Shared Type** | `packages/types/src/` | `{name}.ts` | `observation.ts` |
| **Config** | `apps/api/core/` | `{name}.py` | `config.py` |

---

## 6. Naming Conventions

### 6.1 Python Conventions

| Context | Convention | Example |
| :--- | :--- | :--- |
| **Files** | `snake_case.py` | `create_event.py` |
| **Classes** | `PascalCase` | `CreateEvent`, `EventRepository` |
| **Functions** | `snake_case` | `create_event()`, `fuse_crowd_state()` |
| **Interfaces** | `I` prefix + PascalCase | `IDataSource`, `IRiskPredictor` |
| **Enums (class)** | `PascalCase` | `class EventStatus(Enum)` |
| **Enums (values)** | `SCREAMING_SNAKE_CASE` | `DRAFT`, `CONFIGURATION`, `LIVE` |
| **Constants** | `SCREAMING_SNAKE_CASE` | `MAX_ZONE_CAPACITY = 5000` |
| **Private** | `_` prefix | `_internal_method()` |
| **Dunder** | `__` prefix/suffix | `__init__`, `__str__` |

### 6.2 TypeScript Conventions

| Context | Convention | Example |
| :--- | :--- | :--- |
| **Files** | `kebab-case.ts` or `PascalCase.tsx` | `auth-store.ts`, `EventMap.tsx` |
| **Interfaces** | `PascalCase` | `StandardObservation`, `CrowdState` |
| **Types** | `PascalCase` | `type RiskLevel = "LOW" \| "HIGH"` |
| **Enums** | `PascalCase` | `enum RiskLevel { LOW, HIGH }` |
| **Functions** | `camelCase` | `createEvent()`, `fuseCrowdState()` |
| **Hooks** | `use` prefix + PascalCase | `useCrowdState`, `useWebSocket` |
| **Components** | `PascalCase.tsx` | `RiskPanel.tsx`, `ZoneEditor.tsx` |
| **Props** | `{Component}Props` interface | `RiskPanelProps` |
| **Stores** | `{name}-store.ts` | `auth-store.ts`, `event-store.ts` |

### 6.3 API Conventions

| Context | Convention | Example |
| :--- | :--- | :--- |
| **Routes** | `/api/v1/{feature}` | `/api/v1/events`, `/api/v1/zones` |
| **DB Tables** | `snake_case` plural | `events`, `zones`, `gates` |
| **DB Columns** | `snake_case` | `event_id`, `created_at` |
| **Migrations** | `{timestamp}_{description}.py` | `20260809_create_events.py` |
| **WebSocket Events** | `SCREAMING_SNAKE_CASE` | `RISK_UPDATE`, `CROWD_STATE_UPDATE` |
| **Domain Events** | `PascalCase` past tense | `EventCreated`, `RiskLevelChanged` |

---

## 7. Event-Driven Architecture

### 7.1 In-Process Event Bus (Hackathon)

```text
┌─────────────────────────────────────────────────────────────┐
│                     EVENT BUS (In-Process)                   │
│                    core/events.py                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ObservationReceived ──→ FusionEngine ──→ CrowdStateUpdated │
│                                                              │
│  CrowdStateUpdated ──→ RiskEngine ──→ RiskLevelChanged      │
│                                                              │
│  RiskLevelChanged ──→ DecisionEngine ──→ Recommendation     │
│                                                              │
│  InterventionApproved ──→ NotificationService ──→ WebSocket │
│                                                              │
│  IncidentCreated ──→ NotificationService                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Production Event Bus (Future)

Replace in-process with:
- **Redis Pub/Sub** for simple event streaming
- **Kafka** for high-throughput, durable event streaming

---

## 8. Microservices-Ready Boundaries

Each feature module has clear boundaries. To split into microservices later:

| Current Feature Module | Future Microservice | Communication |
| :--- | :--- | :--- |
| `features/auth` | Auth Service | HTTP/JWT |
| `features/events` | Event Service | HTTP |
| `features/fusion` | Fusion Service | Kafka events |
| `features/risk` | Risk Service | Kafka events |
| `features/recommendations` | Decision Service | Kafka events |
| `features/incidents` | Incident Service | Kafka events |

The in-process event bus makes it trivial to swap to Kafka/Redis later.

---

## 9. CITIZEN NAVIGATION MODULE

### Backend: `apps/api/features/navigation/`

```
features/navigation/
├── __init__.py
├── domain/
│   ├── __init__.py
│   ├── entities/
│   │   ├── __init__.py
│   │   ├── group.py              # Group profile (size, special needs)
│   │   ├── journey.py            # User journey (source → destination)
│   │   └── safe_route.py         # Computed safe route with crowd weights
│   ├── interfaces/
│   │   ├── __init__.py
│   │   └── i_route_engine.py     # Route calculation interface
│   └── enums/
│       ├── __init__.py
│       ├── transport_mode.py     # DRIVE, WALK, TRANSIT
│       └── group_profile.py      # SOLO, COUPLE, FAMILY, GROUP, LARGE_GROUP
├── application/
│   ├── __init__.py
│   ├── use_cases/
│   │   ├── __init__.py
│   │   ├── plan_group_journey.py # Compute best route for group
│   │   ├── navigate.py           # Turn-by-turn with crowd data
│   │   └── check_reroute.py      # Reroute on congestion
│   └── services/
│       ├── __init__.py
│       └── navigation_service.py # Integrates with crowd state
├── infrastructure/
│   ├── __init__.py
│   ├── engines/
│   │   ├── __init__.py
│   │   ├── route_engine.py       # A* (A-Star) Algorithm with crowd weights
│   │   └── navigation_engine.py  # Turn-by-turn generation
│   └── adapters/
│       ├── __init__.py
│       └── osm_adapter.py        # OpenStreetMap road network
└── api/
    ├── __init__.py
    ├── routes.py                 # POST /navigation/plan, WS /navigation/live
    └── schemas.py
```

### Frontend: `apps/web/src/features/citizen-navigation/`

```
features/citizen-navigation/
├── components/
│   ├── JourneyPlanner.tsx          # Source → Destination input
│   ├── GroupSizeSelector.tsx       # +/- buttons, special needs
│   ├── RouteMap.tsx                # Map with route overlay
│   ├── NavigationPanel.tsx         # Turn-by-turn directions
│   ├── CrowdOverlay.tsx            # Real-time crowd density on route
│   ├── GateRecommendation.tsx      # "Use Gate G5 — Low queue"
│   ├── GroupTipCard.tsx            # Family-specific tips
│   └── ExitPlanner.tsx             # Best exit + route home
├── hooks/
│   ├── useJourney.ts
│   ├── useNavigation.ts
│   ├── useLiveReroute.ts
│   └── useGroupCoordination.ts
└── api/
    └── navigation-client.ts
```
