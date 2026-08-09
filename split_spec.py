import os
import re

MASTER_FILE = 'docs/00_MASTER_SPEC.md'

# Destination mapping for each section prefix
MAPPING = {
    # 01_PRD.md
    '2. PROJECT PURPOSE': 'docs/01_PRD.md',
    '3. PRIMARY SCOPE': 'docs/01_PRD.md',
    '4. CORE USERS': 'docs/01_PRD.md',
    '5. PWA REQUIREMENT': 'docs/01_PRD.md',
    '38. HUMAN-IN-THE-LOOP': 'docs/01_PRD.md',
    '47. MULTILINGUAL COMMUNICATION': 'docs/01_PRD.md',
    '48. GENERATIVE AI': 'docs/01_PRD.md',
    '49. VOICE COMMAND CENTER': 'docs/01_PRD.md',
    '50. OFFLINE / NETWORK FAILURE': 'docs/01_PRD.md',
    '51. SECURITY': 'docs/01_PRD.md',
    '52. PRIVACY': 'docs/01_PRD.md',
    '56. DO NOT BUILD EVERYTHING AT ONCE': 'docs/01_PRD.md',
    '57. HACKATHON MVP': 'docs/01_PRD.md',
    '58. DEMO SCENARIO': 'docs/01_PRD.md',

    # 02_TRD.md / 03_HLD.md
    '6. EVENT-FIRST ARCHITECTURE': 'docs/03_HLD.md',
    '53. TECHNICAL ARCHITECTURE': 'docs/03_HLD.md',
    '54. BACKEND MODULES': 'docs/02_TRD.md',
    '61. FINAL SYSTEM PRINCIPLE': 'docs/03_HLD.md',
    '62. FINAL ARCHITECTURE': 'docs/03_HLD.md',
    '63. BUILDING INSTRUCTION': 'docs/02_TRD.md',

    # 11_DOMAIN_MODEL.md
    '7. EVENT CREATION': 'docs/11_DOMAIN_MODEL.md',
    '8. EVENT MAP / VENUE BUILDER': 'docs/11_DOMAIN_MODEL.md',
    '9. EVENT BOUNDARY': 'docs/11_DOMAIN_MODEL.md',
    '10. ZONE BUILDER': 'docs/11_DOMAIN_MODEL.md',
    '11. CUSTOM ROUTE SYSTEM': 'docs/11_DOMAIN_MODEL.md',
    '12. GPS ROUTE RECORDING': 'docs/11_DOMAIN_MODEL.md',
    '13. TEMPORARY EVENT INFRASTRUCTURE': 'docs/11_DOMAIN_MODEL.md',
    '14. SMART GATE SYSTEM': 'docs/11_DOMAIN_MODEL.md',
    '15. SMART GATE STATUS': 'docs/11_DOMAIN_MODEL.md',
    '16. GATE-ZONE-ROUTE RELATIONSHIP': 'docs/11_DOMAIN_MODEL.md',
    '44. MAP REQUIREMENTS': 'docs/11_DOMAIN_MODEL.md',
    '45. DIGITAL TWIN': 'docs/11_DOMAIN_MODEL.md',
    '46. PRE-EVENT SIMULATION': 'docs/11_DOMAIN_MODEL.md',

    # 05_DFD.md / 08_API_AND_EVENTS_SCHEMA.md
    '17. DATA SOURCES': 'docs/05_DFD.md',
    '18. CCTV SOURCE': 'docs/05_DFD.md',
    '19. CITIZEN GPS': 'docs/05_DFD.md',
    '24. SYNTHETIC DATA': 'docs/05_DFD.md',
    '25. CROWD DATA FUSION HUB': 'docs/05_DFD.md',
    '26. STANDARD OBSERVATION FORMAT': 'docs/08_API_AND_EVENTS_SCHEMA.md',
    '27. EVENT ISOLATION': 'docs/08_API_AND_EVENTS_SCHEMA.md',
    '28. SOURCE HEALTH MONITORING': 'docs/05_DFD.md',
    '29. SOURCE CONFIDENCE': 'docs/05_DFD.md',
    '30. SENSOR FUSION': 'docs/05_DFD.md',
    '31. SENSOR DISAGREEMENT DETECTION': 'docs/05_DFD.md',
    '55. DATA PIPELINE': 'docs/05_DFD.md',

    # 04_LLD.md
    '32. CROWD STATE': 'docs/04_LLD.md',
    '33. CROWD ANALYTICS': 'docs/04_LLD.md',
    '34. RISK ENGINE': 'docs/04_LLD.md',
    '35. PREDICTION HORIZON': 'docs/04_LLD.md',
    '36. RISK LEVELS': 'docs/04_LLD.md',
    '37. DECISION ENGINE': 'docs/04_LLD.md',
    '39. RECOMMENDATION EXPLANATION': 'docs/04_LLD.md',

    # 06_UI_WIRE_FRAMES.md
    '40. POLICE DASHBOARD': 'docs/06_UI_WIRE_FRAMES.md',
    '41. AUTHORITY DASHBOARD': 'docs/06_UI_WIRE_FRAMES.md',
    '42. EVENT OWNER DASHBOARD': 'docs/06_UI_WIRE_FRAMES.md',
    '43. CITIZEN PWA': 'docs/06_UI_WIRE_FRAMES.md',

    # 10_AI_AGENT_INSTRUCTIONS.md (This was already migrated by user, but in case they missed sections)
    '59. DEVELOPMENT PRINCIPLES FOR THE AI CODING AGENT': 'docs/10_AI_AGENT_INSTRUCTIONS.md',
    '60. IMPORTANT AI AGENT BEHAVIOR': 'docs/10_AI_AGENT_INSTRUCTIONS.md',
}

def split_and_distribute():
    if not os.path.exists(MASTER_FILE):
        print(f"File {MASTER_FILE} not found!")
        return

    with open(MASTER_FILE, 'r', encoding='utf-8') as f:
        master_content = f.read()

    # Create 11_DOMAIN_MODEL.md if it doesn't exist
    if not os.path.exists('docs/11_DOMAIN_MODEL.md'):
        with open('docs/11_DOMAIN_MODEL.md', 'w', encoding='utf-8') as f:
            f.write("# Domain Model (Events, Zones, Gates, Routes)\n**Project Name:** CrowdShield\n\n---\n\n")

    # Split by level 1 headings
    sections = re.split(r'\n(?=# \d+\.)', '\n' + master_content)
    
    # Clean up empty strings
    sections = [s.strip() for s in sections if s.strip()]

    appended_content = {k: "\n\n---\n\n" for k in set(MAPPING.values())}
    
    for section in sections:
        # Extract the title
        lines = section.split('\n')
        title_line = lines[0]
        # E.g. "# 2. PROJECT PURPOSE"
        # Match against mapping keys
        matched_file = None
        for key in MAPPING.keys():
            if title_line.startswith(f"# {key}"):
                matched_file = MAPPING[key]
                break
        
        if matched_file:
            # Change top level headers to level 2 to fit into existing documents gracefully
            modified_section = section.replace('# ' + title_line[2:], '## ' + title_line[2:])
            appended_content[matched_file] += modified_section + "\n\n"
        else:
            print(f"Unmatched section: {title_line}")

    # Append to files
    for filepath, content in appended_content.items():
        if content.strip() != "---":
            print(f"Appending to {filepath}...")
            with open(filepath, 'a', encoding='utf-8') as f:
                f.write(content)

    # Empty out MASTER_SPEC but leave a redirect
    with open(MASTER_FILE, 'w', encoding='utf-8') as f:
        f.write("# 00. MASTER SPECIFICATION (ARCHIVED)\n\n")
        f.write("> **NOTICE:** This document has been successfully modularized and split across the `docs/` folder.\n\n")
        f.write("- Product Requirements: [01_PRD.md](./01_PRD.md)\n")
        f.write("- Technical Requirements: [02_TRD.md](./02_TRD.md)\n")
        f.write("- High Level Design: [03_HLD.md](./03_HLD.md)\n")
        f.write("- Low Level Design: [04_LLD.md](./04_LLD.md)\n")
        f.write("- Data Flow Diagrams: [05_DFD.md](./05_DFD.md)\n")
        f.write("- UI Wireframes: [06_UI_WIRE_FRAMES.md](./06_UI_WIRE_FRAMES.md)\n")
        f.write("- Deployment & Ops: [07_DEPLOYMENT_AND_OPS.md](./07_DEPLOYMENT_AND_OPS.md)\n")
        f.write("- API & Event Schemas: [08_API_AND_EVENTS_SCHEMA.md](./08_API_AND_EVENTS_SCHEMA.md)\n")
        f.write("- Testing Strategy: [09_TESTING_AND_QA_STRATEGY.md](./09_TESTING_AND_QA_STRATEGY.md)\n")
        f.write("- AI Agent Instructions: [10_AI_AGENT_INSTRUCTIONS.md](./10_AI_AGENT_INSTRUCTIONS.md)\n")
        f.write("- Domain Model: [11_DOMAIN_MODEL.md](./11_DOMAIN_MODEL.md)\n")

    print("Success: MASTER_SPEC has been modularized and archived.")

if __name__ == "__main__":
    split_and_distribute()
