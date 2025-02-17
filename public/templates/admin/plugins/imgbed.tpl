<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->

	<div class="row m-0">
		<div id="spy-container" class="col-12 px-0 mb-4" tabindex="0">
			<form id="imgbed_acp" class="form imgbed-settings">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="card mb-3">
              <div class="card-body">
                <label for="extensions" class="form-label">Allowed Extensions</label>
                <input
                  id="extensions"
                  class="form-control"
                  type="text"
                  placeholder="jpeg,jpg,gif,gifv,png,svg"
                  data-key="strings.extensions" />
                <p class="form-text">Comma-separated list of image extensions that are allowed:</p>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <label for="parseMode" class="form-label">Parsing Mode</label>
                <select
                  id="parseMode"
                  class="form-select"
                  data-key="strings.parseMode">
                  <option>markdown</option>
                  <option>bbcode</option>
                  <option>html</option>
                </select>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="card card-warning">
              <div class="card-body">
                <h6 class="card-title"><i class="fa-solid fa-triangle-exclamation"></i> Clear the posts cache</h6>
                <p class="text-sm">To have your changes take effect immediately, you will need to clear the
                posts cache, which can have a short-term effect on performance.</p>
                <button class="btn btn-warning" id="clearPostCache">Clear Posts cache</button>
              </div>
            </div>
          </div>
        </div>
      </form>
		</div>
	</div>
</div>

