"""
Events Feature — GeoPoint Value Object
"""

from dataclasses import dataclass
from shared.domain.base_value_object import BaseValueObject


@dataclass(frozen=True)
class GeoPoint(BaseValueObject):
    lat: float
    lng: float
