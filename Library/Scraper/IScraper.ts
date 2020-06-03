import { Link } from '../Models/Link'

export interface IScraper {
  /**
   * Extract links from a page.
   *
   * @param url Url of the page to extract links from.
   * @param query A function to be evaluated in the browser context.
   */
  extract(
    url: string,
    query: () => { name: string; url: string }[]
  ): Promise<Link[]>

  /**
   * Sign in, and returns the cookie.
   *
   * @param loginUrl - Url of the login page.
   * @param redirectUrl - Url of the redirected page after signing in.
   */
  getCookie(loginUrl: string, redirectUrl: string): Promise<string>
}
