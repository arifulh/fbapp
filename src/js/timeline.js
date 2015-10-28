(function() {


  function Timeline() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this.pointer = 0;
    this.cache = {};
    this.init();
    return this;
  }

  Timeline.prototype = {
    init: function() {
      this.insert({ t: null, nullNode: true })
      return this;
    },
    insert: function(data) {
      var node = this.createNode(data), after;
      var ptr = this.head, nn = this.head;

      if (!this.length) {
        this.head = node;
        this.tail = this.head;
        this.length++;
        return;
      }

      while (nn ) {
        if (node.data.t > nn.data.t ) ptr = nn; 
        if (nn) nn = nn.next;
      }

      this.append(node, ptr);
    },

    append: function(node, after) {
      var appendAfter = this.tail;
      if (after) appendAfter = after;
      node.prev = appendAfter.prev;
      node.next = appendAfter.next;
      appendAfter.next = node;
      apendAfter = node;
      if (!node.next) this.tail = node;
      if(!node.data.nullNode) this.length++;
    },

    prepend: function(node, before) {
      var prependBefore = this.head;
      if (before) prependBefore = before;
      node.next = prependBefore.next;
      node.prev = prependBefore.prev;
      prependBefore.prev = node;
      if (!node.prev) this.head = node;
    },

    createNode: function(data) {
      function node(d){
        this.next = null;
        this.prev = null;
        this.data = d;
      }
      return new node(data);
    },

    list: function(from, to) {
      var len = this.length, 
          node = this.head,
          arr = [];

      from = from || 0;
      to = to || from;

      if (this.cache[from-2]) { node = this.cache[from-2]; } 

      while (node) {
        if (node && !node.data.nullNode) {
          if (node.data.t >= from && node.data.t <= to) {
            arr.push(node);
            if (!this.cache[node.data.t]) 
              this.cache[node.data.t] = node;
          }
        }
        node = node.next;
      }
      return arr;
    }


  };

  window.Timeline = Timeline;

}());