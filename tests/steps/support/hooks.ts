import { After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { bddState } from './state';

setDefaultTimeout(60_000);

After(async function (scenario) {
  try {
    if (scenario.result?.status === Status.FAILED && bddState.page) {
      const screenshot = await bddState.page.screenshot({ fullPage: true });
      await this.attach(screenshot, 'image/png');
    }
  } catch (e) {
    // best-effort diagnostics
  } finally {
    await bddState.page?.close().catch(() => {});
    await bddState.browser?.close().catch(() => {});
    bddState.page = undefined;
    bddState.browser = undefined;
  }
});
