from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.datamodel.base_models import InputFormat

pipeline_options = PdfPipelineOptions()
pipeline_options.do_formula_enrichment = True

converter = DocumentConverter(format_options={
    InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
})
source = "https://arxiv.org/pdf/2408.09869"  # document per local path or URL
print("loading>>>")
result = converter.convert(source)
print(result.document.export_to_element_tree())  # output: "## Docling Technical Report[...]"
print(result.document.export_to_dict())