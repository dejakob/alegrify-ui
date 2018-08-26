const fs = require('fs');

reactify();

function reactify() {
    const cssCollection = {};

    grabCssDetails();

    Object.keys(cssCollection).forEach(collectionToReact);

    function grabCssDetails() {
        let cssContent = fs.readFileSync('./alegrify-ui.css').toString();
        const regex = /alegrify-([a-z0-9-]+)(?:__)?([a-z0-9-]+)?(?:\:)?([a-z0-9-]+)?(?:\[)?([a-z0-9-]+)?(?:\])?/;
    
        while (cssContent.match(regex)) {
            const match = cssContent.match(regex);
            const nameAndVariant = match[1];
            const [name, variant] = nameAndVariant.split('--');
            cssCollection[name] = cssCollection[name] || {
                variants: [],
                states: [],
                children: [],
                pseudo: []
            };
    
            if (variant) {
                if (cssCollection[name].variants.indexOf(variant) === -1) {
                    cssCollection[name].variants.push(variant);
                }
            }
    
            const map = [null, null, 'children', 'pseudo', 'states'];
            for (let i = 2; i < 5; i++) {
                if (match[i] && cssCollection[name][map[i]].indexOf(match[i]) === -1) {
                    cssCollection[name][map[i]].push(match[i]);
                }
            }
    
    
            cssContent = cssContent.replace(regex, '');
        }
    }


    function collectionToReact(component) {
        const { variants, states, children, pseudo } = cssCollection[component];

        const componentName = camelizeString(component);

        const template = `
import React from 'react';
import PropTypes from 'prop-types';

/**
 * <${componentName} />
 */ 
function ${componentName}(props) {
    const classNames = ['${component}'];

${variants.map(variant => `
    if (props.${camelizeExceptFirst(variant)}) {
        classNames.push('${component}--${variant}');
    }

`).join(' ')}
    return (
        <div
            className={classNames.join(' ')}
            {...props}
        />
    );
}

${componentName}.propTypes = {
${variants.map(variant => `    ${camelizeExceptFirst(variant)}: PropTypes.bool`).join(',\n')}
};
        `;

        console.log(template);
    }

    function camelizeString(string) {
        return string
            .split('-')
            .map(word => word.length ? word.replace(word[0], word[0].toUpperCase()) : '')
            .join('');
    }

    function camelizeExceptFirst(string) {
        return camelizeString(string)
            .split('')
            .map((letter, index) => index === 0 ? letter.toLowerCase() : letter)
            .join('');
    }

}