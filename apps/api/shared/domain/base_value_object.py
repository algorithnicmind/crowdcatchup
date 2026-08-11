"""
Shared Kernel — Base Value Object
Doc 12 §3.1 Rule 6: Value objects are immutable and compared by value.
ZERO external dependencies — pure Python only.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class BaseValueObject:
    """
    Base class for all value objects.
    Immutable (frozen dataclass) and compared by structural equality.
    """

    def __eq__(self, other):
        if not isinstance(other, self.__class__):
            return False
        return self.__dict__ == other.__dict__

    def __hash__(self):
        return hash(tuple(sorted(self.__dict__.items())))
