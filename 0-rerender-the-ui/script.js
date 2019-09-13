// application state object
let state = {
	loading: false,
	query: '',
	results: null,
};

// UI components, mapping props (data) to UI (HTML markup)
function UI(props) {
	return [
		SearchBox({ query: props.query, onChange: 'doSearch()' }),
		props.loading && LoadingPlaceholder({ query: props.query }),
		props.results && DomainsList({ domains: props.results }),
	];
}

function SearchBox(props) {
	return [
		'Enter a domain name or keyword: ',
		`<input type="text" value="${props.query}" onChange="${props.onChange}"/>`,
	];
}

function LoadingPlaceholder(props) {
	return `<div>Searching for ${props.query}...</div>`;
}

function DomainsList(props) {
	return ['<ul>', props.domains.map(Domain), '</ul>'];
}

function Domain(props) {
	return `<li>${props.domain_name} (${props.cost})</li>`;
}

// Event handlers
function doSearch() {
	const query = this.event.target.value;
	setState({ loading: true, query });

	WPCOM()
		.domains()
		.suggestions(query)
		.then(results => {
			if (state.query !== query) {
				return;
			}
			setState({ loading: false, results });
		})
		.catch(() => {
			setState({ loading: false });
		});
}

// Proto-React implementation that rerenders UI on every state update
function htmlstring(ui) {
	if (Array.isArray(ui)) {
		return ui.map(htmlstring).join('');
	} else if (typeof ui === 'string') {
		return ui;
	} else {
		return '';
	}
}

function render() {
	const container = document.querySelector('main');
	const ui = UI(state);
	container.innerHTML = htmlstring(ui);
}

function setState(newState) {
	state = { ...state, ...newState };
	render();
}

// Do the initial render!
render();
