from typing import List, Optional
from io import BytesIO

from PIL import Image

_image_model = None
_text_model = None


def _load_image_model():
    global _image_model
    if _image_model is None:
        # Lazy import to avoid heavy startup cost if not used
        from sentence_transformers import SentenceTransformer

        # CLIP image-text model; supports image embeddings via PIL Images
        _image_model = SentenceTransformer("clip-ViT-B-32")
    return _image_model


def _load_text_model():
    global _text_model
    if _text_model is None:
        # Lazy import to avoid heavy startup cost if not used
        from sentence_transformers import SentenceTransformer

        # Text model optimized for semantic similarity
        _text_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _text_model


def image_bytes_to_embedding(image_bytes: bytes) -> List[float]:
    """Convert raw image bytes into a CLIP embedding (list[float])."""
    model = _load_image_model()

    img = Image.open(BytesIO(image_bytes)).convert("RGB")

    # sentence-transformers encode handles list of PIL images
    emb = model.encode([img], convert_to_numpy=True, normalize_embeddings=True)[0]
    return emb.astype(float).tolist()


def text_to_embedding(text: str) -> List[float]:
    """Convert text into a sentence transformer embedding (list[float])."""
    model = _load_text_model()
    
    # Encode text and normalize
    emb = model.encode([text], convert_to_numpy=True, normalize_embeddings=True)[0]
    return emb.astype(float).tolist()


