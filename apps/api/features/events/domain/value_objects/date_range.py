"""
Events Feature — DateRange Value Object
"""

from dataclasses import dataclass
from datetime import datetime
from shared.domain.base_value_object import BaseValueObject


@dataclass(frozen=True)
class DateRange(BaseValueObject):
    start_date: datetime | None
    end_date: datetime | None

    def __post_init__(self):
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValueError("start_date cannot be after end_date")
