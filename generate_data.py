import csv
import json
import random

schools = [
    {"id": "SCH-001", "name": "School Alpha", "cluster": "Western"},
    {"id": "SCH-002", "name": "School Beta", "cluster": "Western"},
    {"id": "SCH-003", "name": "School Gamma", "cluster": "Northern"},
    {"id": "SCH-004", "name": "School Delta", "cluster": "Northern"},
    {"id": "SCH-005", "name": "School Epsilon", "cluster": "Southern"},
    {"id": "SCH-006", "name": "School Zeta", "cluster": "Southern"},
    {"id": "SCH-007", "name": "School Eta", "cluster": "Western"},
    {"id": "SCH-008", "name": "School Theta", "cluster": "Western"},
    {"id": "SCH-009", "name": "School Iota", "cluster": "Northern"},
    {"id": "SCH-010", "name": "School Kappa", "cluster": "Northern"},
]

segments = ["All", "Early Years", "Primary", "Secondary"]

# Metrics definition
# Some metrics are segment-specific, others are school-wide (All only)
metrics_config = {
    "Marketing": [
        {"name": "Enquiries", "unit": "Count", "min": 50, "max": 400, "by_segment": True},
        {"name": "Visits", "unit": "Count", "min": 30, "max": 250, "by_segment": True},
        {"name": "Applications", "unit": "Count", "min": 15, "max": 150, "by_segment": True},
        {"name": "Enrolled", "unit": "Count", "min": 10, "max": 100, "by_segment": True},
        {"name": "Velocity", "unit": "Days", "min": 80, "max": 150, "by_segment": True},
        {"name": "Inquiry to Enrolled CVR", "unit": "%", "min": 15, "max": 45, "by_segment": True}, # Derived usually, but simplifed here
    ],
    "Performance": [
        {"name": "Student FTE", "unit": "FTE", "min": 100, "max": 800, "by_segment": True},
        {"name": "Budget FTE", "unit": "FTE", "min": 105, "max": 850, "by_segment": True}, # To calculate variance
        {"name": "Capacity Utilization", "unit": "%", "min": 60, "max": 98, "by_segment": False}, # Usually facility based
        {"name": "EBITDA Margin", "unit": "%", "min": 15, "max": 35, "by_segment": False}, 
    ],
    "Sentiment": [
        {"name": "NPS Score", "unit": "Score", "min": 10, "max": 75, "by_segment": True},
        {"name": "Value for Money", "unit": "1-5", "min": 3.0, "max": 4.8, "by_segment": True},
        {"name": "Quality of Teaching", "unit": "1-5", "min": 3.5, "max": 4.9, "by_segment": True},
    ],
    "Academic": [
        {"name": "IB Avg Score", "unit": "Score", "min": 29, "max": 39, "by_segment": False}, # Usually Secondary
        {"name": "A-Level A*-A", "unit": "%", "min": 20, "max": 65, "by_segment": False}, # Secondary
    ],
    "People": [
        {"name": "Teacher Attrition", "unit": "%", "min": 5, "max": 25, "by_segment": False},
        {"name": "MAC Attrition", "unit": "%", "min": 5, "max": 35, "by_segment": False},
    ]
}

rows = []

def get_status(metric, value, yoy):
    # Logic for status
    try:
        yoy_val = float(str(yoy).replace('%', '').replace(' pts', '').replace('+', '').replace(' days', ''))
        
        # High is Bad metrics
        if "Attrition" in metric or "Velocity" in metric:
            if yoy_val > 5: return "Critical"
            if yoy_val > 2: return "Warning"
            return "Good"
        
        # High is Good metrics
        if yoy_val < -5: return "Critical"
        if yoy_val < 0: return "Warning"
        return "Good"
    except:
        return "Stable"

for school in schools:
    for segment in segments:
        for category, metrics in metrics_config.items():
            for m in metrics:
                # Skip segment generation if metric is only school-wide (All)
                if not m["by_segment"] and segment != "All":
                    continue
                
                # Base Values
                val = 0
                if m["unit"] == "1-5":
                    val = round(random.uniform(m["min"], m["max"]), 2)
                elif m["unit"] == "Score":
                    val = int(random.uniform(m["min"], m["max"]))
                else:
                    val = round(random.uniform(m["min"], m["max"]), 1)
                
                # Adjustments for Specific Segments (e.g., Velocity usually higher in Secondary)
                if m["name"] == "Velocity":
                    if segment == "Early Years": val = int(random.uniform(80, 100))
                    elif segment == "Primary": val = int(random.uniform(100, 120))
                    elif segment == "Secondary": val = int(random.uniform(120, 150))
                
                # Adjustments for "All" (Summing up for counts)
                if segment == "All" and m["by_segment"] and m["unit"] == "Count":
                    # Rough multiplier for total
                    val = val * 3 

                # YoY Generation
                yoy_raw = random.uniform(-15, 20)
                yoy_str = f"{yoy_raw:+.1f}%"
                if m["unit"] == "Score" or m["unit"] == "1-5":
                     yoy_str = f"{yoy_raw/5:+.1f} pts"
                if m["unit"] == "Days":
                     yoy_str = f"{int(yoy_raw)} days"

                status = get_status(m["name"], val, yoy_str)

                rows.append({
                    "School ID": school["id"],
                    "School Name": school["name"],
                    "Segment": segment,
                    "Metric Category": category,
                    "Metric Name": m["name"],
                    "Value": val,
                    "Unit": m["unit"],
                    "YoY Var": yoy_str,
                    "Status": status
                })

# Write JS Data
js_file = "c:/Users/admin/Desktop/scan/data.js"
with open(js_file, 'w') as f:
    f.write("const scanData = ")
    f.write(json.dumps(rows, indent=2))
    f.write(";\n\n")
    # Helper to restructure for easier lookup in JS
    f.write("""
// Helper to grouping: School -> Segment -> Category -> Metrics
const schoolsDataStructure = {};
scanData.forEach(row => {
    const sId = row['School ID'];
    const seg = row['Segment'];
    
    if (!schoolsDataStructure[sId]) {
        schoolsDataStructure[sId] = {
            id: sId,
            name: row['School Name'],
            segments: {}
        };
    }
    
    if (!schoolsDataStructure[sId].segments[seg]) {
        schoolsDataStructure[sId].segments[seg] = {};
    }
    
    if (!schoolsDataStructure[sId].segments[seg][row['Metric Category']]) {
        schoolsDataStructure[sId].segments[seg][row['Metric Category']] = [];
    }
    
    schoolsDataStructure[sId].segments[seg][row['Metric Category']].push(row);
});
""")
    
    
print("Data Generated")
