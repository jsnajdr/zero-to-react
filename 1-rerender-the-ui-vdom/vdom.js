function VDOM() {
	const changed = function( node1, node2 ) {
		return typeof node1 !== typeof node2 ||
					 typeof node1 === 'string' && node1 !== node2 ||
					 node1.type !== node2.type
	};

	const createElement = function( node ) {
		if ( typeof node !== 'object' ) {
			return document.createTextNode( node );
		}

		const $el = document.createElement( node.type );

		Object.keys( node.props ).map( prop => {
			const propName = prop === 'className' ? 'class' : prop;
			$el.setAttribute( propName, node.props[ prop ] );
		} );

		node.children
			.map( createElement )
			.map( $el.appendChild.bind( $el ) );

		return $el;
	};

	// Credits to: https://github.com/lucasfcosta/vdom-example
	return {
		createElement: function( type, props, children = [] ) {
			props = props || {};
			children = children || {};

			return { type, props, children };
		},

		render: function( $parent, newNode, oldNode, index = 0 ) {
			if ( ! oldNode ) {
				$parent.appendChild(
					createElement( newNode )
				);
			} else if ( ! newNode ) {
				$parent.removeChild(
					$parent.childNodes[ index ]
				);
			} else if ( changed( newNode, oldNode ) ) {
				$parent.replaceChild(
					createElement( newNode ),
					$parent.childNodes[ index ]
				);
			} else if ( newNode.type ) {
				const newLength = newNode.children.length;
				const oldLength = oldNode.children.length;
				for ( let i = 0; i < Math.max( newLength, oldLength ); i++ ) {
					this.render(
						$parent.childNodes[ index ],
						newNode.children[ i ],
						oldNode.children[ i ],
						i
					);
				}
			}
		},

	};
}
