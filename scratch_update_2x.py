
import re
file_path = "/home/ubuntu-wsl/projects/Raja_web/content/projects.ts"
with open(file_path, "r", encoding="utf-8") as f: content = f.read()

def replace_project_media(content, project_id, new_media_array_str):
    pattern = r'(\.\.\.P\("' + re.escape(project_id) + r'".*?media:\s*)(?:\[.*?\]|\(\[.*?\]\s*satisfies\s*ImageAsset\[\]\))(,?)'
    if re.search(pattern, content, flags=re.DOTALL):
        return re.sub(pattern, r'\1' + new_media_array_str + r'\2', content, count=1, flags=re.DOTALL)
    pattern_inline = r'(\.\.\.P\("' + re.escape(project_id) + r'".*?media:\s*)\[[^\]]+\](,?)'
    if re.search(pattern_inline, content):
        return re.sub(pattern_inline, r'\1' + new_media_array_str + r'\2', content, count=1)
    return content

content = replace_project_media(content, "art-of-living-navaratri-2023", """[
      { src: "/media/projects/2x/art-of-living-navaratri-2023.webp", width: 1440, height: 960, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "isgcon-2023", """[
      { src: "/media/projects/2x/isgcon-2023.webp", width: 1600, height: 1178, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "la-renon-company-event", """[
      { src: "/media/projects/2x/la-renon-company-event.webp", width: 2560, height: 1920, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "fc-expo-2024", """[
      { src: "/media/projects/2x/fc-expo-2024.webp", width: 3000, height: 1996, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "eima-agrimach-2024", """[
      { src: "/media/projects/2x/eima-agrimach-2024.webp", width: 1706, height: 940, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "kanha-shanti-vanam-tent-city", """[
      { src: "/media/projects/2x/kanha-shanti-vanam-tent-city.webp", width: 4000, height: 2666, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "abs-education-fair", """[
      { src: "/media/projects/2x/abs-education-fair.webp", width: 1600, height: 1742, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "collegedunia-education-fair", """[
      { src: "/media/projects/2x/collegedunia-education-fair.webp", width: 2400, height: 1600, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "gte-2024", """[
      { src: "/media/projects/2x/gte-2024.webp", width: 2400, height: 1800, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "central-silk-board-conference", """[
      { src: "/media/projects/2x/central-silk-board-conference.webp", width: 1600, height: 1066, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "vaidic-dharma-navaratri-2024", """[
      { src: "/media/projects/2x/vaidic-dharma-navaratri-2024.webp", width: 1600, height: 1067, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "hampi-utsav-2024", """[
      { src: "/media/projects/2x/hampi-utsav-2024.webp", width: 1600, height: 896, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "adichunchanagiri-founders-day", """[
      { src: "/media/projects/2x/adichunchanagiri-founders-day.webp", width: 1600, height: 900, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "fc-expo-2025", """[
      { src: "/media/projects/2x/fc-expo-2025.webp", width: 2048, height: 792, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "krishi-mela-2024-25", """[
      { src: "/media/projects/2x/krishi-mela-2024-25.webp", width: 1600, height: 1058, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "pourakarmika-samavesha", """[
      { src: "/media/projects/2x/pourakarmika-samavesha.webp", width: 1600, height: 1205, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "buildtek-silver-jubilee", """[
      { src: "/media/projects/2x/buildtek-silver-jubilee.webp", width: 1600, height: 1600, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "vaidic-dharma-navaratri", """[
      { src: "/media/projects/2x/vaidic-dharma-navaratri.webp", width: 1600, height: 1209, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "valmiki-jayanti-2025", """[
      { src: "/media/projects/2x/valmiki-jayanti-2025.webp", width: 1476, height: 828, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "mm-hills", """[
      { src: "/media/projects/2x/mm-hills.webp", width: 1600, height: 900, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "world-fisheries-day-2024", """[
      { src: "/media/projects/2x/world-fisheries-day-2024.webp", width: 1600, height: 1067, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "biffes-17", """[
      { src: "/media/projects/2x/biffes-17.webp", width: 1600, height: 891, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "karthik-live", """[
      { src: "/media/projects/2x/karthik-live.webp", width: 1600, height: 2851, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "dam-safety-conference", """[
      { src: "/media/projects/2x/dam-safety-conference.webp", width: 1600, height: 897, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "fifth-annual-convocation", """[
      { src: "/media/projects/2x/fifth-annual-convocation.webp", width: 1600, height: 1067, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "babu-jagjivan-ram-119", """[
      { src: "/media/projects/2x/babu-jagjivan-ram-119.webp", width: 1600, height: 930, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
content = replace_project_media(content, "vidyapeeta-education-expo", """[
      { src: "/media/projects/2x/vidyapeeta-education-expo.webp", width: 1600, height: 1067, alt: "Final Production Photograph", clearance: "client-approved" }
    ]""")
with open(file_path, "w", encoding="utf-8") as f: f.write(content)
