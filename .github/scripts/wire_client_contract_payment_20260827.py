from pathlib import Path

updates = {
    'admin.html': '<script type="module" src="assets/js/admin-client-contract-payment-20260827.js?v=20260827-1"></script>',
    'client/phyto/index.html': '<script type="module" src="../../assets/js/phyto-contract-payment-20260827.js?v=20260827-1"></script>',
    'client/phyto/contract.html': '<script type="module" src="../../assets/js/phyto-contract-payment-20260827.js?v=20260827-1"></script>',
}

for filename, tag in updates.items():
    path = Path(filename)
    text = path.read_text(encoding='utf-8')
    if tag in text:
        continue
    if '</body>' not in text:
        raise RuntimeError(f'</body> not found in {filename}')
    text = text.replace('</body>', f'  {tag}\n</body>', 1)
    path.write_text(text, encoding='utf-8')
