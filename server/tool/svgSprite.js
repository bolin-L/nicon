module.exports = function (clazz, icons) {
    let svgSpriteStr = `<style type="text/css">
        ${clazz} {
            width: 1em; height: 1em;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
        }
        </style>
        <svg aria-hidden="true" style="position: absolute; width: 0px; height: 0px; overflow: hidden;">{placeholder}</svg>`;
    let symbolStr = '';
    for (let icon of icons) {
        symbolStr += icon.iconContent.replace(/<svg/ig, `<symbol id="${clazz}-${icon.iconName}" class="${clazz}"`)
            .replace('</svg>', '</symbol>');
    }
    return svgSpriteStr.replace('{placeholder}', symbolStr);
};
