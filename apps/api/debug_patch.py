import asyncio
import httpx
from httpx import AsyncClient
from main import app

async def run():
    # Disable middleware to surface exact exception
    app.user_middleware.clear()
    transport = httpx.ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        reg_res = await client.post('/api/v1/auth/register', json={
            'email': 'prof_test@crowdshield.ai', 
            'password': 'StrongPass123!', 
            'full_name': 'Original Name', 
            'role': 'AUTHORITY'
        })
        print('Reg:', reg_res.status_code)
        
        patch_res = await client.patch('/api/v1/auth/me/profile', json={
            'full_name': 'Updated Name', 
            'phone_number': '+919876543210'
        }, headers={'X-User-Email': 'prof_test@crowdshield.ai'})
        print('Patch:', patch_res.status_code, patch_res.text)

asyncio.run(run())
