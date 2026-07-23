import unittest
import xml.etree.ElementTree as ET
from pathlib import Path


VECTOR_DIR = (
    Path(__file__).resolve().parents[2]
    / "Obsidain"
    / "GEO知识库"
    / "03-已入库"
    / "group-123"
    / "assets"
    / "vector"
)
SAMPLE_DIR = VECTOR_DIR.parents[1]

DIAGRAMS = {
    "figure-01-alpharank-layered-architecture.svg": {
        "Application Layer",
        "GEO 数据看板",
        "验证评估 Agent",
        "Knowledge Graph",
        "数据治理与合规",
        "AlphaRank 产品内部闭环",
    },
    "figure-02-geo-agentic-architecture.svg": {
        "GEO/AEO Architecture",
        "PromptEngineer",
        "Agent Teams",
        "Agent Personality",
        "ContextEngineering",
        "Data Flywheel (ETLA)",
    },
    "figure-03-runtime-detail.svg": {
        "UI/Bot",
        "Gateway",
        "GEO-AgenticCluster",
        "PromptBuilder",
        "LLMRouter",
        "Context",
    },
    "figure-04-geo-workflow.svg": {
        "问题发现",
        "内容诊断",
        "Gap 分析",
        "优化建议",
        "内容生成",
        "发布验证",
    },
}


class VectorDiagramTests(unittest.TestCase):
    def test_diagrams_are_editable_svg_with_required_labels(self) -> None:
        for filename, required_labels in DIAGRAMS.items():
            with self.subTest(filename=filename):
                path = VECTOR_DIR / filename
                self.assertTrue(path.is_file(), f"missing diagram: {path}")
                root = ET.parse(path).getroot()
                self.assertTrue(root.tag.endswith("svg"))
                self.assertIn("viewBox", root.attrib)
                image_elements = [node for node in root.iter() if node.tag.endswith("image")]
                self.assertEqual(image_elements, [], "SVG must not embed raster images")
                all_text = " ".join(
                    "".join(node.itertext())
                    for node in root.iter()
                    if node.tag.endswith("text")
                )
                for label in required_labels:
                    self.assertIn(label, all_text)
                editable_nodes = [node for node in root.iter() if "data-node" in node.attrib]
                self.assertGreaterEqual(len(editable_nodes), 6)

    def test_obsidian_documents_embed_vector_redraws(self) -> None:
        for document in ("faithful.md", "readable.md"):
            with self.subTest(document=document):
                content = (SAMPLE_DIR / document).read_text(encoding="utf-8")
                for filename in DIAGRAMS:
                    self.assertIn(f"assets/vector/{filename}", content)
                self.assertNotIn("![AlphaRank 四层整体架构](assets/figures/", content)
                self.assertNotIn("![GEO/AEO Agentic 架构](assets/figures/", content)


if __name__ == "__main__":
    unittest.main()
