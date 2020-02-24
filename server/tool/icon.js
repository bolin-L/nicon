/**
 * 工程中根据res/icon/svg/*.svg
 * 自动生成字体图标-cqh
 */

let gulp = require('gulp');
let iconfont = require('gulp-iconfont');
let consolidate = require('gulp-consolidate');
let rename = require('gulp-rename');
let rev = require('gulp-rev');
let path = require('path');
let fileUtil = require('../util/fileUtil');

module.exports = {
    async compileSvg2Icon (repoPath, iconPrefix, fontPath = '../fonts/') {
        let svgPath = path.join(repoPath, './svg/*.svg');
        let templatePath = path.join(__dirname, './iconTemplate/');
        // 先清除文件夹，防止缓存
        await fileUtil.deleteDirector(path.join(repoPath, './css'));
        await fileUtil.deleteDirector(path.join(repoPath, './fonts'));

        await this.compileIcon(iconPrefix, fontPath, svgPath, templatePath, repoPath);
    },
    compileIcon (iconPrefix, fontPath, svgPath, templatePath, repoPath) {
        return new Promise((resolve, reject) => {
            try {
                gulp.src([svgPath])
                    .pipe(iconfont({
                        fontName: iconPrefix,
                        // prependUnicode: true,
                        // startUnicode: 0xE001,
                        formats: ['svg', 'ttf', 'eot', 'woff'],
                        normalize: true,
                        centerHorizontally: true,
                        fontHeight: 1024 // must need for perfect icon
                    }))
                    .on('glyphs', function (glyphs, options) {
                        glyphs.forEach(function (glyph, idx, arr) {
                            arr[idx].codePoint = glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
                        });
                        gulp.src(path.join(templatePath, './iconTemplate.css'))
                            .pipe(consolidate('lodash', {
                                glyphs: glyphs,
                                fontName: iconPrefix,
                                fontPath: '../fonts/',
                                cssClass: iconPrefix
                            }))
                        // css 给demo文件用
                            .pipe(rename('icons.css'))
                            .pipe(rev())
                            .pipe(gulp.dest(path.join(repoPath, './css/')))
                            .on('finish', function () {
                                console.log('css file generation over!');
                            })
                    })
                    .pipe(rev())
                    .pipe(gulp.dest(path.join(repoPath, './fonts/')))
                    .on('finish', function () {
                        console.log('font generation over');
                        resolve();
                    });
            } catch (e) {
                throw new Error(e);
            }
        })
    }
};
