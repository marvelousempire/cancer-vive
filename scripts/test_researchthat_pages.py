import importlib.util
from pathlib import Path
import tempfile
import shutil
import unittest
spec=importlib.util.spec_from_file_location('pages',Path(__file__).with_name('build-researchthat-pages.py'));pages=importlib.util.module_from_spec(spec);spec.loader.exec_module(pages)

class PublicCarrierTests(unittest.TestCase):
    def test_exact_artifact_and_existing_output_refusal(self):
        with tempfile.TemporaryDirectory()as tmp:
            output=Path(tmp)/'site';receipt=pages.build(output)
            self.assertEqual(receipt['files'],13)
            with self.assertRaises(ValueError):pages.build(output)
            self.assertEqual((output/'index.html').read_bytes(),(pages.ROOT/'public-researchthat/index.html').read_bytes())
    def test_changed_and_extra_file_refused(self):
        with tempfile.TemporaryDirectory()as tmp:
            root=Path(tmp);shutil.copytree(pages.ROOT/'public-researchthat',root/'public-researchthat');shutil.copy2(pages.ROOT/'public-researchthat-carrier.json',root)
            index=root/'public-researchthat/index.html';original=index.read_bytes();index.write_bytes(original+b'changed')
            with self.assertRaises(ValueError):pages.verify(root)
            index.write_bytes(original);(root/'public-researchthat/private.sqlite').write_bytes(b'private')
            with self.assertRaises(ValueError):pages.verify(root)
if __name__=='__main__':unittest.main()
