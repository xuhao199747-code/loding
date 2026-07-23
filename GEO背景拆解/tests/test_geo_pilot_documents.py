import unittest
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DELIVERABLES = ROOT / "deliverables" / "geo-pilots"


class GeoPilotDocumentsTests(unittest.TestCase):
    def test_each_pilot_has_three_linked_documents(self):
        titles = [
            "Adversarial AI Search Engine",
            "SEO Diagnostic Agent 技术方案",
            "品牌行业库",
        ]
        for title in titles:
            main = DELIVERABLES / f"{title}.md"
            faithful = DELIVERABLES / f"{title}｜忠实还原.md"
            quality = DELIVERABLES / f"{title}｜质量报告.md"
            self.assertTrue(main.is_file(), main)
            self.assertTrue(faithful.is_file(), faithful)
            self.assertTrue(quality.is_file(), quality)
            text = main.read_text()
            self.assertIn(f"[[wiki/GEO/来源/{title}｜忠实还原|忠实还原版]]", text)
            self.assertIn(f"[[wiki/GEO/来源/{title}｜质量报告|质量报告]]", text)
            self.assertIn("![[raw/GEO/首批样板/", text)

    def test_adversarial_document_preserves_four_risk_types(self):
        text = (DELIVERABLES / "Adversarial AI Search Engine｜忠实还原.md").read_text()
        for label in ["提示注入", "外部操纵", "诋毁攻击", "夸张声明"]:
            self.assertIn(label, text)

    def test_brand_table_preserves_all_eleven_companies(self):
        text = (DELIVERABLES / "品牌行业库｜忠实还原.md").read_text()
        companies = [
            "PepsiCo", "Tesla", "Uniqlo", "UGG", "Alibaba Cloud",
            "Dell Technologies", "PayPal", "COSCO", "Target", "L'Oréal", "Alibaba",
        ]
        # 原图实际包含 11 个公司行；测试以逐行证据为准。
        for company in companies:
            self.assertIn(company, text)
        self.assertEqual(text.count("| www."), 11)

    def test_full_and_pm_diagrams_are_valid_and_have_different_depth(self):
        full = DELIVERABLES / "SEO Diagnostic Agent 技术架构｜完整技术版.svg"
        simple = DELIVERABLES / "SEO Diagnostic Agent 技术架构｜PM简易版.svg"
        full_root = ET.parse(full).getroot()
        simple_root = ET.parse(simple).getroot()
        full_text = " ".join((node.text or "") for node in full_root.iter())
        simple_text = " ".join((node.text or "") for node in simple_root.iter())
        for label in [
            "RuntimeRouter", "web_crawler", "seo_diagnose", "technical_analyzer",
            "on_page_analyzer", "schema_analyzer", "content_analyzer", "Scorer",
            "Reporter", "DiagnosticReport JSON (0-100)", "Phase 1", "Phase 2",
        ]:
            self.assertIn(label, full_text)
        for label in ["用户输入", "路由", "抓取与诊断", "四类分析", "评分", "诊断报告"]:
            self.assertIn(label, simple_text)
        ns = "{http://www.w3.org/2000/svg}"
        self.assertGreater(len(full_root.findall(f".//{ns}rect")), len(simple_root.findall(f".//{ns}rect")))


if __name__ == "__main__":
    unittest.main()
