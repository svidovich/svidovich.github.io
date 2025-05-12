import argparse
import json
from inspect import cleandoc
from pathlib import Path
from typing import Final, NamedTuple

ART_FOLDER_URL: Final[str] = "https://vidovi.ch/media/art-and-stuff"
ME: Final[str] = "Sam Vidovich"

LOICENSE_NAME: Final[str] = "CC0"
LOICENSE_URL: Final[str] = "https://creativecommons.org/publicdomain/zero/1.0/"
LOICENSE_NOTICE: Final[str] = (
    "This image has been dedicated to the public domain under CC0 by {name}."
)


class RenderedPair(NamedTuple):
    """
    A container for a rendered HTML document and a JSON-LD document for some image.
    If `description` isn't provided
    """

    html: str
    json_ld: str


def generate_html_and_schema(
    path: Path | str,
    name: str | None = None,
    description: str | None = None,
    creator_name: str | None = ME,
    noninteractive: bool = False,
    url_prefix: str = ART_FOLDER_URL,
) -> RenderedPair:
    """
    Run the generation for the input path, returning a tuple containing both rendered
    HTML and JSON-LD.

    """
    path = Path(path)
    if not path.is_file():
        raise FileNotFoundError(f"File not found: {path}")

    url_path = f"{url_prefix}/{path.name}"
    # If a name wasn't provided for JSON-LD, make one from the filename.
    if not name:
        name = path.stem.replace("-", " ").title()
    if not description and not noninteractive:
        description = input(f"Description for '{path.name}': ").strip()

    # HTML <figure>
    html = cleandoc(
        f"""
        <figure>
          <a href="{url_path}" target="_blank">
            <img src="{url_path}" alt="{description or path.stem}" width="300px" />
          </a>
          <figcaption>{description or path.stem}</figcaption>
        </figure>
        """
    )

    # Schema.org JSON-LD. By default, we'll form up a name from the file itself.
    schema = {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "name": name,
        "contentUrl": url_path,
        "creator": {"@type": "Person", "name": creator_name},
        "description": description or path.stem,
        "license": LOICENSE_URL,
        "acquireLicensePage": LOICENSE_URL,
        "copyrightNotice": LOICENSE_NOTICE.format(name=creator_name),
        "creditText": f"Image provided by {creator_name} under {LOICENSE_NAME}.",
    }
    json_ld_prefix = '<script type="application/ld+json">'
    json_ld_suffix = "</script>"
    json_ld = f"{json_ld_prefix}\n{json.dumps(schema, indent=2)}\n{json_ld_suffix}"

    return RenderedPair(html=html, json_ld=json_ld)


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Generate <figure> and schema.org markup for an image, and print them to "
            "the console."
        )
    )
    parser.add_argument(
        "-i",
        "--input-path",
        required=True,
        help="Path to image file for which we'll generate the elements.",
    )
    parser.add_argument(
        "-d",
        "--description",
        help=(
            "Optional image description for the rendered JSON-LD. If not provided, it "
            "will default to the name of the file without its extension."
        ),
        required=False,
    )
    parser.add_argument(
        "-x",
        "--noninteractive",
        help="Don't ask for a description interactively if one isn't provided.",
        required=False,
        action="store_true",
    )
    parser.add_argument(
        "-u",
        "--prefix-url",
        help=(
            "The folder where the image is found on the net as a URL. "
            f"Default: `{ART_FOLDER_URL}`"
        ),
        required=False,
        default=ART_FOLDER_URL,
    )
    parser.add_argument(
        "-c",
        "--creator-name",
        help=f"Who is making the figure? Default: `{ME}`",
        required=False,
        default=ME,
    )
    parser.add_argument(
        "-n",
        "--name",
        help=f"The name of the figure for JSON-LD.",
        required=False,
    )

    args = parser.parse_args()

    figure, jsonld = generate_html_and_schema(
        path=args.input_path,
        name=args.name,
        description=args.description,
        creator_name=args.creator_name,
        noninteractive=args.noninteractive,
        url_prefix=args.prefix_url,
    )
    print("\n=== HTML Figure ===\n")
    print(figure)
    print("\n=== JSON-LD Schema ===\n")
    print(jsonld)


if __name__ == "__main__":
    main()
