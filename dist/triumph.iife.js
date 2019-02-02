/** MIT License
* 
* Copyright (c) 2018 Ludovic CLUBER 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* http://triumphjs.lcluber.com
*/

var Triumph = (function (exports) {
  'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /** MIT License
  * 
  * Copyright (c) 2015 Ludovic CLUBER 
  * 
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  * http://mouettejs.lcluber.com
  */
  var LEVELS = [{
    id: 1,
    name: 'info'
  }, {
    id: 2,
    name: 'trace'
  }, {
    id: 3,
    name: 'warn'
  }, {
    id: 4,
    name: 'error'
  }, {
    id: 99,
    name: 'off'
  }];

  var Message =
  /*#__PURE__*/
  function () {
    function Message(levelName, content) {
      this.setLevel(levelName);
      this.content = content;
    }

    var _proto = Message.prototype;

    _proto.setLevel = function setLevel(name) {
      this.level = this.findLevel(name);
    };

    _proto.getLevelId = function getLevelId() {
      return this.level.id;
    };

    _proto.display = function display() {
      console[this.level.name](this.content);
    };

    _proto.findLevel = function findLevel(name) {
      for (var _i = 0; _i < LEVELS.length; _i++) {
        var level = LEVELS[_i];

        if (level.name === name) {
          return level;
        }
      }

      return this.level ? this.level : LEVELS[0];
    };

    return Message;
  }();

  var Logger =
  /*#__PURE__*/
  function () {
    function Logger() {}

    Logger.info = function info(text) {
      Logger.log('info', text);
    };

    Logger.trace = function trace(text) {
      Logger.log('trace', text);
    };

    Logger.time = function time(text) {
      Logger.log('time', text);
    };

    Logger.warn = function warn(text) {
      Logger.log('warn', text);
    };

    Logger.error = function error(text) {
      Logger.log('error', text);
    };

    Logger.log = function log(levelName, content) {
      Logger.addMessage(levelName, content);
      var message = this.messages[this.nbMessages - 1];

      if (this._level.id <= message.getLevelId()) {
        message.display();
      }
    };

    Logger.addMessage = function addMessage(levelName, content) {
      this.messages.push(new Message(levelName, content));
      this.nbMessages++;
    };

    Logger.findLevel = function findLevel(name) {
      for (var _i2 = 0; _i2 < LEVELS.length; _i2++) {
        var level = LEVELS[_i2];

        if (level.name === name) {
          return level;
        }
      }

      return this._level ? this._level : LEVELS[0];
    };

    _createClass(Logger, [{
      key: "level",
      set: function set(name) {
        Logger._level = Logger.findLevel(name);
      },
      get: function get() {
        return Logger._level.name;
      }
    }]);

    return Logger;
  }();

  Logger._level = Logger.findLevel(LEVELS[0].name);
  Logger.messages = [];
  Logger.nbMessages = 0;
  Logger.target = document.getElementById('Mouette');

  var Achievement =
  /*#__PURE__*/
  function () {
    function Achievement(name, title, description, value, children, image, reward) {
      this.name = name;
      this.title = title;
      this.description = description;
      this.children = children || new Achievements();
      this.value = children ? 0 : value;
      this.date = 0;
      this.image = image;
      this.reward = reward;
    }

    var _proto = Achievement.prototype;

    _proto.isActive = function isActive() {
      return this.date ? true : false;
    };

    _proto.activate = function activate(timestamp) {
      this.date = timestamp ? timestamp : Date.now();

      if (this.reward) {
        this.reward.activate(this.date);
      }

      return this.children.score.points || 1;
    };

    _proto.try = function _try(value, timestamp) {
      if (!this.isActive()) {
        if (this.children.length()) {
          var childrenPoints = this.children.score.points;
          this.children.try(null, value, timestamp);

          if (this.children.progress === 100) {
            return this.activate(timestamp);
          } else if (this.children.score.points > childrenPoints) {
            return this.children.score.points - childrenPoints;
          }
        } else if (this.value <= value) {
          return this.activate(timestamp);
        }
      }

      return 0;
    };

    _proto.export = function _export(name) {
      name = name ? name : this.name;

      if (this.children.length()) {
        return this.children.export(name);
      } else if (this.isActive()) {
        return [{
          name: name,
          value: this.value,
          date: this.date
        }];
      }

      return false;
    };

    return Achievement;
  }();

  var Score =
  /*#__PURE__*/
  function () {
    function Score() {
      this.points = 0;
      this.total = 0;
    }

    var _proto = Score.prototype;

    _proto.getProgress = function getProgress() {
      return Math.floor(this.points / this.total * 100);
    };

    _proto.updateProgress = function updateProgress(points) {
      this.points += points;
      return this.getProgress();
    };

    return Score;
  }();

  var Achievements =
  /*#__PURE__*/
  function () {
    function Achievements() {
      this.list = [];
      this.progress = 0;
      this.score = new Score();
    }

    var _proto = Achievements.prototype;

    _proto.add = function add(name, title, description, value, children, image, reward) {
      if (!this.get(name)) {
        this.list.push(new Achievement(name, title, description, value, children, image, reward));
        this.score.total++;

        if (children) {
          this.score.total += children.score.total;
        }

        return true;
      }

      Logger.warn('Achievement name already exists.');
      return false;
    };

    _proto.getPoints = function getPoints() {
      return this.score.points;
    };

    _proto.getTotalPoints = function getTotalPoints() {
      return this.score.total;
    };

    _proto.get = function get(name) {
      for (var _iterator = this.list, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var achievement = _ref;

        if (achievement.name === name) {
          return achievement;
        }
      }

      return false;
    };

    _proto.length = function length() {
      return this.list.length;
    };

    _proto.try = function _try(name, value, timestamp) {
      if (this.progress < 100) {
        if (name) {
          var achv = this.get(name);

          if (achv) {
            this.test(achv, value, timestamp);
          }
        } else {
          for (var _iterator2 = this.list, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref2 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref2 = _i2.value;
            }

            var _achv = _ref2;
            this.test(_achv, value, timestamp);
          }
        }
      }
    };

    _proto.export = function _export(name) {
      var achvs = [];

      for (var _iterator3 = this.list, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref3 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref3 = _i3.value;
        }

        var achv = _ref3;
        var exp = achv.export(name);

        if (exp) {
          achvs.push(exp);
        }
      }

      if (achvs.length) {
        return [].concat.apply([], achvs);
      }

      return false;
    };

    _proto.test = function test(achievement, value, timestamp) {
      var newPoints = achievement.try(value, timestamp);

      if (newPoints) {
        this.progress = this.score.updateProgress(newPoints);
        return true;
      }

      return false;
    };

    return Achievements;
  }();

  var Reward =
  /*#__PURE__*/
  function () {
    function Reward(name, title, description, image) {
      this.name = name;
      this.title = title;
      this.description = description;
      this.image = image;
      this.date = 0;
    }

    var _proto = Reward.prototype;

    _proto.isActive = function isActive() {
      return this.date ? true : false;
    };

    _proto.activate = function activate(timestamp) {
      if (!this.isActive()) {
        this.date = timestamp;
        return true;
      }

      return false;
    };

    return Reward;
  }();

  var Rewards =
  /*#__PURE__*/
  function () {
    function Rewards() {
      this.list = [];
    }

    var _proto = Rewards.prototype;

    _proto.add = function add(name, title, description, image) {
      if (!this.get(name)) {
        this.list.push(new Reward(name, title, description, image));
        return true;
      }

      Logger.warn('Reward name already exists.');
      return false;
    };

    _proto.get = function get(name) {
      for (var _iterator = this.list, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var reward = _ref;

        if (reward.name === name) {
          return reward;
        }
      }

      return false;
    };

    _proto.length = function length() {
      return this.list.length;
    };

    return Rewards;
  }();

  exports.Achievements = Achievements;
  exports.Rewards = Rewards;

  return exports;

}({}));