/**
 * Whole code from https://deno.land/x/elmedeno@1.0.1/mod.ts
 * without Dynamic import for Deno Deploy
 */
// deno-lint-ignore-file
import crossDomain from 'elmedeno/deps/crossdomain/index.ts';
import csp from 'elmedeno/deps/csp/index.ts';
import dnsPrefetchControl from 'elmedeno/deps/dns-prefetch-control/index.ts';
import dontSniffMimetype from 'elmedeno/deps/dont-sniff-mimetype/index.ts';
import expectCt from 'elmedeno/deps/expect-ct/index.ts';
import featurePolicy from 'elmedeno/deps/feature-policy/index.ts';
import frameguard from 'elmedeno/deps/frameguard/index.ts';
import hidePoweredBy from 'elmedeno/deps/hide-powered-by/index.ts';
import hsts from 'elmedeno/deps/hsts/index.ts';
import ieNoOpen from 'elmedeno/deps/ienoopen/index.ts';
import referrerPolicy from 'elmedeno/deps/referrer-policy/index.ts';
import xssProtection from 'elmedeno/deps/x-xss-protection/index.ts';
import { Options } from 'elmedeno/lib/Options.ts';
import lib from 'elmedeno/lib/frameworks/opine.ts';

export * from 'elmedeno/lib/Options.ts';

export class Elmedeno {
  private _options: Options;
  private _frameworkLib: any;

  constructor(options: Options = {}) {
    this._options = options;
  }

  private async init() {
    this._frameworkLib = lib;
  }

  public async protect(request: any, response: any): Promise<any> {
    await this.init();
    const requestResponse: any = new this._frameworkLib(request, response);

    if (this._options.crossDomain !== null) {
      crossDomain(requestResponse, this._options.crossDomain);
    }

    if (this._options.csp !== null) {
      csp(requestResponse, this._options.csp);
    }

    if (this._options.dnsPrefetchControl !== null) {
      dnsPrefetchControl(requestResponse, this._options.dnsPrefetchControl);
    }

    if (this._options.dontSniffMimetype !== null) {
      dontSniffMimetype(requestResponse);
    }

    if (this._options.expectCt !== null) {
      expectCt(requestResponse, this._options.expectCt);
    }

    if (this._options.featurePolicy !== null) {
      featurePolicy(requestResponse, this._options.featurePolicy);
    }

    if (this._options.frameguard !== null) {
      frameguard(requestResponse, this._options.frameguard);
    }

    if (this._options.hidePoweredBy !== null) {
      hidePoweredBy(requestResponse, this._options.hidePoweredBy);
    }

    if (this._options.hsts !== null) {
      hsts(requestResponse, this._options.hsts);
    }

    if (this._options.ieNoOpen !== null) {
      ieNoOpen(requestResponse);
    }

    if (this._options.referrerPolicy !== null) {
      referrerPolicy(requestResponse, this._options.referrerPolicy);
    }

    if (this._options.xssProtection !== null) {
      xssProtection(requestResponse, this._options.xssProtection);
    }

    return requestResponse.response;
  }
}
