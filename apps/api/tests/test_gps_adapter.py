import pytest
from datetime import datetime, timedelta
from features.adapters.gps_adapter import MobileGpsAdapter

@pytest.fixture
def clean_adapter():
    adapter = MobileGpsAdapter()
    return adapter

def test_device_ingestion_and_zone_mapping(clean_adapter):
    # Send ping for device inside ENTRANCE_A polygon: [(0.0, 0.0), (0.0, 0.001), (0.001, 0.001), (0.001, 0.0)]
    clean_adapter.ingest_ping("device-1", 0.0005, 0.0005)
    
    # Send ping for device inside MAIN_HALL polygon: [(0.001, 0.0), (0.001, 0.002), (0.003, 0.002), (0.003, 0.0)]
    clean_adapter.ingest_ping("device-2", 0.002, 0.001)
    
    observations = clean_adapter.get_zone_counts("evt-test")
    
    # Check that observations list has 3 items (one for each zone)
    assert len(observations) == 3
    
    # Find counts
    entrance_count = next(obs.value for obs in observations if obs.zone_id == "ENTRANCE_A")
    main_hall_count = next(obs.value for obs in observations if obs.zone_id == "MAIN_HALL")
    food_court_count = next(obs.value for obs in observations if obs.zone_id == "FOOD_COURT")
    
    assert entrance_count == 1
    assert main_hall_count == 1
    assert food_court_count == 0

def test_stale_device_removal(clean_adapter):
    # Ingest a device
    clean_adapter.ingest_ping("device-1", 0.0005, 0.0005)
    
    # Manually backdate the last_seen to 40 seconds ago
    clean_adapter.active_devices["device-1"]["last_seen"] = datetime.utcnow() - timedelta(seconds=40)
    
    observations = clean_adapter.get_zone_counts("evt-test")
    entrance_count = next(obs.value for obs in observations if obs.zone_id == "ENTRANCE_A")
    
    # The device should have been removed from active devices and count should be 0
    assert entrance_count == 0
    assert "device-1" not in clean_adapter.active_devices
