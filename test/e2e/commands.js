const commands = {
  pause(time) {
    this.api.pause(time);
    return this;
  },
  yesClearValue(selector) {
    this.getValue(selector, function (result) {
      const newValue = `${new Array(result.value.length).fill('\u0008').join('')}`;
      this.setValue(selector, newValue);
    });
    return this;
  },
};

export default commands;
