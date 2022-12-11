from dataclasses import dataclass
from dataclasses import field
from decimal import Decimal


@dataclass(frozen=True)
class Product:
    id: int
    upc: int
    name: str
    department_id: str
    date: str
    store: str
    prices: dict[str, Decimal] = field(default_factory=dict)
    specs: dict[str, str] = field(default_factory=dict)
