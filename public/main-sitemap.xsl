<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; color: #333; margin: 0; padding: 20px; }
          #content { max-width: 960px; margin: 0 auto; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; border-bottom: 1px solid #eee; text-align: left; }
          th { background-color: #f8f9fa; font-weight: 600; border-bottom: 2px solid #ddd; }
          tr:hover td { background-color: #f1f1f1; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
          h1 { margin-bottom: 10px; }
          p { margin-top: 0; color: #666; }
        </style>
      </head>
      <body>
        <div id="content">
          <h1>XML Sitemap</h1>
          <p>This is an XML Sitemap generated to help search engines easily discover URLs.</p>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
            <p>This sitemap index contains <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps.</p>
            <table>
              <thead>
                <tr>
                  <th>Sitemap URL</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <tr>
                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td>
                      <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                      <xsl:text> </xsl:text>
                      <xsl:value-of select="substring(sitemap:lastmod, 12, 5)"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
          <xsl:if test="count(sitemap:urlset/sitemap:url) &gt; 0">
            <p>This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.</p>
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Images</th>
                  <th>Last Modified</th>
                  <th>Change Frequency</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td><xsl:value-of select="count(image:image)"/></td>
                    <td>
                      <xsl:value-of select="substring(sitemap:lastmod, 0, 11)"/>
                      <xsl:text> </xsl:text>
                      <xsl:value-of select="substring(sitemap:lastmod, 12, 5)"/>
                    </td>
                    <td><xsl:value-of select="sitemap:changefreq"/></td>
                    <td><xsl:value-of select="sitemap:priority"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
