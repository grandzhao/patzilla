import os

from setuptools import setup, find_packages
#from distutils.core import setup

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()
CHANGES = open(os.path.join(here, 'CHANGES.rst')).read()

requires = [

    # ----------------------------------------------
    #   Environment
    # ----------------------------------------------
    'setuptools>=36.4.0',
    'six>=1.10.0',


    # ----------------------------------------------
    #   Backend
    # ----------------------------------------------
    # pyramid core
    #'pyramid==1.5a2',
    'pyramid==1.9.1',
    'pyramid_debugtoolbar',
    'Pygments==2.2.0',
    'pyramid_mako',
    'Jinja2==2.9.6',
    #'Akhet==2.0',
    'waitress',
    'Paste==2.0.3',
    'PasteScript==2.0.2',

    # caching
    'Beaker==1.9.0',
    'pyramid_beaker==0.8',

    # Can't upgrade to pymongo-3.5.1 due to "from pymongo.connection import Connection" usage in "mongodb_gridfs_beaker" module.
    'pymongo==2.9.5',
    'mongodb_gridfs_beaker==0.5.4',

    # web services
    'cornice==2.4.0',

    # authorization
    'pycrypto==2.6.1',
    'jws==0.1.3',
    'python_jwt==2.0.2',
    'pbkdf2==1.3',


    # ----------------------------------------------
    #   Infrastructure
    # ----------------------------------------------

    # HTTP
    'requests==2.18.4',
    'requests-oauthlib==0.8.0',
    'mechanize==0.3.5',

    # HTML
    'BeautifulSoup==3.2.1',

    # SNI support
    'pyOpenSSL>=16.0.0',
    'cryptography>=1.3',
    'pyasn1==0.3.4',
    'ndg-httpsclient==0.4.3',


    # ----------------------------------------------
    #   Business logic
    # ----------------------------------------------
    'Bunch==1.0.1',
    'ago==0.0.9',
    'pyparsing==2.0.2',
    'mongoengine==0.13.0',
    'blinker==1.4',
    'python-dateutil==2.6.1',
    'lxml==3.8.0',
    'openpyxl==2.1.0',
    'xlrd==0.9.3',
    'XlsxWriter==0.9.3',
    'jsonpointer==1.10',
    'arrow==0.10.0',
    'transitions==0.2.4',
    'validate_email==1.3',
    'pandas==0.18.1',
    'html2text==2016.9.19',
    'envoy==0.0.3',

]

test_requires = [
    # ----------------------------------------------
    #   testing
    # ----------------------------------------------
    'nose==1.3.3',
    'nose-exclude==0.2.0',
    'nose2-cov==1.0a4',
]

setup(name='PatZilla',
      version='0.135.0',
      description='PatZilla is a powerful patent information research platform and toolkit with a modern user interface.',
      long_description=README,
      license="AGPL 3, EUPL 1.2",
      classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
      ],
      author='Andreas Motl',
      author_email='andreas.motl@elmyra.de',
      url='https://github.com/ip-tools/ip-navigator',
      keywords='web wsgi pylons pyramid',
      packages=find_packages(),
      include_package_data=True,
      package_data={
          'patzilla.navigator': [
              'resources/*.*',
              'templates/*.mako',
              'static/js/**/*.js', 'static/js/**/*.map', 'static/js/**/*.swf', '**/**/*.css',
              '**/**/*.jpg', '**/**/*.gif', '**/**/*.svg', '**/**/**/*.svg',
              'static/widget/**/**/*.*',
          ],
          'patzilla.util.render': ['*.js'],
      },
      zip_safe=False,
      test_suite='nose.collector',
      install_requires=requires,
      tests_require=test_requires,
      extras_require={
          'test': test_requires,
      },

      entry_points={
        'paste.app_factory': [
            'main = patzilla.navigator:main',
        ],

        # Now a Beaker builtin as per "ext:mongodb"
        #'beaker.backends': [
        #    'mongodb = patzilla.util.database.beaker_mongodb:MongoDBNamespaceManager',
        #    ],

        'console_scripts': [
        ],

      },

    )