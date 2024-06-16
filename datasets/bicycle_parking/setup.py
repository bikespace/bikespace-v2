from setuptools import find_packages, setup

setup(
    name="bicycle_parking",
    packages=find_packages(exclude=["bicycle_parking_tests"]),
    install_requires=[
        "dagster",
        "geopandas",
        "pandera",
        "pandera[geopandas]",
        "pyogrio",
    ],
    extras_require={"dev": ["dagster-webserver", "pytest"]},
)
