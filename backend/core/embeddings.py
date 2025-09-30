from typing import List, Optional
from io import BytesIO

from PIL import Image

_model = None


def _load_model():
    global _model
    if _model is None:
        # Lazy import to avoid heavy startup cost if not used
        from sentence_transformers import SentenceTransformer

        # CLIP image-text model; supports image embeddings via PIL Images
        _model = SentenceTransformer("clip-ViT-B-32")
    return _model


def image_bytes_to_embedding(image_bytes: bytes) -> List[float]:
    """Convert raw image bytes into a CLIP embedding (list[float])."""
    model = _load_model()

    img = Image.open(BytesIO(image_bytes)).convert("RGB")

    # sentence-transformers encode handles list of PIL images
    emb = model.encode([img], convert_to_numpy=True, normalize_embeddings=True)[0]
    return emb.astype(float).tolist()


