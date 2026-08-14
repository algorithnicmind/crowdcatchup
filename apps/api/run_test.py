import asyncio
import pytest

if __name__ == "__main__":
    pytest.main(["-v", "--tb=native", "tests/test_events_api.py::test_create_and_list_event"])
