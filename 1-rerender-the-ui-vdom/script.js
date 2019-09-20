// application state object
let state = {
	loading: false,
	query: '',
	results: null,
	_currentView: null,
};

// UI components, mapping props (data) to UI (HTML markup)
function UI(props) {
	return VDOM().h( 'div', {}, [
		SearchBox({ query: props.query, onChange: 'doSearch()' }),
		props.loading && LoadingPlaceholder({ query: props.query }),
		props.results && DomainsList({ domains: props.results }),
	].filter( x => x ) );
}

function SearchBox(props) {
	return VDOM().h( 'div', {}, [
		'Enter a domain name or keyword: ',
		VDOM().h( 'input', { type: 'text', value: props.query, onChange: props.onChange } ),
	] );
}

function LoadingPlaceholder(props) {
	return VDOM().h( 'div', null, [ 'Searching for ', props.query, '...' ] );
}

function DomainsList(props) {
	return VDOM().h( 'ul', null, props.domains.map(Domain) );
}

function Domain(props) {
	return VDOM().h( 'li', null, [ props.domain_name, ' (', props.cost, ')' ] );
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

function render() {
	const container = document.getElementById('main');
	const ui = UI(state);

	console.log('rendering:', ui);
	VDOM().updateElement( container, ui, state._currentView );

	state._currentView = ui;
}

function setState(newState) {
	state = { ...state, ...newState };
	console.log('state updated to:', state);
	render();
}

// Do the initial render!
render();
