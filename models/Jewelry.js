var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define User schema 
var JewelrySchema = new Schema({ 
    title: { type : String, default : '',index: { unique: true } },
    price: { type : String, default : '' },
    imageUrl: { type : String, default : '' },
    isSoldOut: { type : Boolean, default : false },
    isExist: { type : Boolean, default : false },
    kind: { type : String, default : '' },
    createdAt: { type : String, default : '0000' }
});
JewelrySchema.methods = {

  /**
   * Save article and upload image
   *
   * @param {Object} images
   * @api private
   */

  uploadAndSave: function (image) {
    const err = this.validateSync();
    if (err && err.toString()) throw new Error(err.toString());
    return this.save();

    /*
    if (images && !images.length) return this.save();
    const imager = new Imager(imagerConfig, 'S3');
    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err);
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files };
      }
      self.save(cb);
    }, 'article');
    */
  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @api private
   */

  addComment: function (user, comment) {
    this.comments.push({
      body: comment.body,
      user: user._id
    });

    if (!this.user.email) this.user.email = 'email@product.com';

    notify.comment({
      article: this,
      currentUser: user,
      comment: comment.body
    });

    return this.save();
  },

  /**
   * Remove comment
   *
   * @param {commentId} String
   * @api private
   */

  removeComment: function (commentId) {
    const index = this.comments
      .map(comment => comment.id)
      .indexOf(commentId);

    if (~index) this.comments.splice(index, 1);
    else throw new Error('Comment not found');
    return this.save();
  }
};

JewelrySchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (options) {
  	let title = options.value || '',
  		limit = options.limit || 10;
    return this.find({title:new RegExp(title,'i')})
      .populate('user', 'username')
      .limit(limit)
      .exec();
  },
	listCount:function(options){
		return this.count()
	},
  /**
   * List articles
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    console.log(JSON.stringify(criteria))
    return this.find(criteria)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};
// export them 
exports.Jewelry = mongoose.model('Jewelry', JewelrySchema);