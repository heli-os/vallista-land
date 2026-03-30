#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MANUSCRIPT="$PROJECT_ROOT/../../_workspace/book/manuscript.md"
OUTPUT_DIR="$PROJECT_ROOT/static/book"
OUTPUT_FILE="$OUTPUT_DIR/작은-팀의-기술.pdf"

# 출력 디렉토리 확인
mkdir -p "$OUTPUT_DIR"

# manuscript.md 존재 확인
if [ ! -f "$MANUSCRIPT" ]; then
  echo "Error: manuscript.md not found at $MANUSCRIPT"
  exit 1
fi

# pandoc 설치 확인
if ! command -v pandoc &> /dev/null; then
  echo "Error: pandoc is not installed. Install with: brew install pandoc"
  exit 1
fi

# HTML 주석 제거한 임시 파일 생성
TEMP_FILE=$(mktemp)
sed 's/<!--.*-->//g' "$MANUSCRIPT" > "$TEMP_FILE"

echo "Building PDF from manuscript.md..."

pandoc "$TEMP_FILE" \
  -o "$OUTPUT_FILE" \
  --pdf-engine=xelatex \
  -V mainfont="Noto Sans KR" \
  -V monofont="Noto Sans Mono" \
  -V geometry:margin=2.5cm \
  -V fontsize=11pt \
  -V documentclass=book \
  -V classoption=oneside \
  --toc \
  --toc-depth=2 \
  -V toc-title="목차" \
  -V lang=ko \
  -V title="작은 팀의 기술" \
  -V subtitle="개발자 출신 창업자의 조직 운영기" \
  -V author="Theo (진태양)" \
  -V date="2026" \
  --highlight-style=tango

rm "$TEMP_FILE"

echo "PDF generated: $OUTPUT_FILE"
echo "Size: $(du -h "$OUTPUT_FILE" | cut -f1)"
