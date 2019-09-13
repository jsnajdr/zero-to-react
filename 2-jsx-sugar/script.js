// application state object
let state = {
	loading: false,
	query: '',
	results: null,
};

// UI components, mapping props (data) to UI (React elements)
function UI(props) {
	return (
		<>
			<SearchBox query={props.query} onChange={doSearch} />
			{props.loading && <LoadingPlaceholder query={props.query} />}
			{props.results && <DomainsList domains={props.results} />}
		</>
	);
}

function SearchBox(props) {
	return (
		<>
			Enter a domain name or keyword:{' '}
			<input type="text" value={props.query} onChange={props.onChange} />
		</>
	);
}

function LoadingPlaceholder(props) {
	return <div>Searching for {props.query}</div>;
}

function DomainsList(props) {
	return (
		<ul>
			{props.domains.map(domain => (
				<Domain name={domain.domain_name} cost={domain.cost} />
			))}
		</ul>
	);
}

function Domain(props) {
	return (
		<li>
			{props.name} ({props.cost})
		</li>
	);
}

// Event handlers
function doSearch(event) {
	const query = event.target.value;
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
	const container = document.querySelector('main');
	const ui = React.createElement(UI, state);
	ReactDOM.render(ui, container);
}

function setState(newState) {
	state = { ...state, ...newState };
	render();
}

// Do the initial render!
render();
