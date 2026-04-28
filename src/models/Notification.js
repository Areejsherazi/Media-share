const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - recipientId
 *         - type
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the notification
 *         recipientId:
 *           type: string
 *           description: The user who will receive the notification
 *         senderId:
 *           type: string
 *           description: The user who triggered the notification
 *         type:
 *           type: string
 *           enum: [like, comment, follow]
 *           description: The type of notification
 *         message:
 *           type: string
 *           description: The notification message
 *         relatedImageId:
 *           type: string
 *           description: The related image ID (for like/comment notifications)
 *         relatedCommentId:
 *           type: string
 *           description: The related comment ID (for reply notifications)
 *         read:
 *           type: boolean
 *           default: false
 *           description: Whether the notification has been read
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the notification was created
 */

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['like', 'comment', 'follow'],
    index: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  relatedImageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
  relatedCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, type: 1, createdAt: -1 });

// Virtual for formatted time
notificationSchema.virtual('timeAgo').get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
});

// Static methods for creating notifications
notificationSchema.statics.createLikeNotification = async function (imageId, likerId, imageOwnerId) {
  // Don't create notification if user likes their own image
  if (likerId.toString() === imageOwnerId.toString()) {
    return null;
  }

  return this.create({
    recipientId: imageOwnerId,
    senderId: likerId,
    type: 'like',
    message: 'Someone liked your photo',
    relatedImageId: imageId
  });
};

notificationSchema.statics.createCommentNotification = async function (imageId, commenterId, imageOwnerId, commentText) {
  // Don't create notification if user comments on their own image
  if (commenterId.toString() === imageOwnerId.toString()) {
    return null;
  }

  return this.create({
    recipientId: imageOwnerId,
    senderId: commenterId,
    type: 'comment',
    message: `Someone commented: "${commentText.substring(0, 50)}${commentText.length > 50 ? '...' : ''}"`,
    relatedImageId: imageId
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
