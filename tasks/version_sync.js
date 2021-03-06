/*
 * grunt-version-sync
 * https://github.com/adgad/grunt-version-sync
 *
 * Copyright (c) 2014 adgad
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    var jsyaml = require('js-yaml');

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    function getType(fileName) {
        var type = 'text';
        if (fileName.indexOf('.json') === fileName.length - 5) {
            type = 'json';
        } else if (fileName.indexOf('.yml') === fileName.length - 4) {
            type = 'yml';
        }
        return type;
    }

    function parseFile(fileName) {
        var type = getType(fileName);
        var obj;
        if (type === 'json') {
            obj = grunt.file.readJSON(fileName);
        } else if (type === 'yml') {
            obj = grunt.file.readYAML(fileName);
        }
        return obj;
    }

    function stringifyObject(obj, type) {
        var stringified;
        if (type === 'json') {
            stringified = JSON.stringify(obj, null, '\t');
        } else if (type === 'yml') {
            stringified = jsyaml.safeDump(obj);
        }
        return stringified;
    }

    grunt.registerMultiTask('version_sync', 'Keeps version numbers in sync between files', function () {
        // Merge task-specific and/or target-specific options with these defaults.

        var version;
        var sourceFileName = this.data.source;
        var sourceData = parseFile(sourceFileName);


        var targetFileType;
        var targetData;


        version = sourceData.version;
        grunt.log.writeln('Using version number ' + version + ' from ' + sourceFileName);

        this.data.targets.forEach(function (targetFileName) {
            targetFileType = getType(targetFileName);
            if(grunt.file.exists(targetFileName)) {
                targetData = parseFile(targetFileName);
                if (targetData.version !== version) {
                    grunt.log.writeln('Updating ' + targetFileName + ' from ' + targetData.version + ' to ' + version);
                    targetData.version = version;
                    grunt.file.write(targetFileName, stringifyObject(targetData, targetFileType));
                } else {
                    grunt.log.writeln(targetFileName + ' already on version ' + version);

                }


            }
        });
    });

};
