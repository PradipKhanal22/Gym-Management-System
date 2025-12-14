import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Trash2, Eye, CheckCircle, Clock, User, Calendar, X } from 'lucide-react';
import { contactAPI } from '../../../src/constant/api/contactAPI';
import { toast } from '../../../components/Toast';
import Sidebar from '../Sidebar';

interface ContactMessage {
  id: number;
  user_id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

  useEffect(() => {
    console.log('MessageList component mounted');
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    console.log('Fetching messages...');
    try {
      const response = await contactAPI.getAll();
      console.log('Messages response:', response);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await contactAPI.markAsRead(id);
      if (response.success) {
        toast.success('Message marked as read');
        fetchMessages();
      }
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const handleDeleteClick = (id: number) => {
    setMessageToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;

    try {
      const response = await contactAPI.delete(messageToDelete);
      if (response.success) {
        toast.success('Message deleted successfully');
        fetchMessages();
        setSelectedMessage(null);
        setShowDeleteModal(false);
        setMessageToDelete(null);
      }
    } catch (error) {
      toast.error('Failed to delete message');
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Contact Messages</h1>
            <p className="text-slate-600">View and manage customer inquiries</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-slate-200">
              <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Messages Yet</h3>
              <p className="text-slate-600">Contact messages will appear here</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-black text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {messages.map((message, index) => (
                      <motion.tr
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`hover:bg-slate-50 transition-colors ${
                          !message.is_read ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          {message.is_read ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                              <CheckCircle className="w-3 h-3" />
                              Read
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold">
                              <Clock className="w-3 h-3" />
                              New
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="font-bold text-slate-900">{message.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-700">{message.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-700 line-clamp-2 max-w-md">
                            {message.message}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedMessage(message)}
                              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {!message.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(message.id)}
                                className="p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-600 transition-colors"
                                title="Mark as read"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteClick(message.id)}
                              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Message Detail Modal */}
          {selectedMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border-2 border-slate-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Message Details</h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-bold text-slate-700">From</span>
                    </div>
                    <p className="font-bold text-slate-900">{selectedMessage.name}</p>
                    <p className="text-sm text-slate-600">{selectedMessage.email}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-bold text-slate-700">Date</span>
                    </div>
                    <p className="text-slate-900">{formatDate(selectedMessage.created_at)}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-bold text-slate-700">Message</span>
                    </div>
                    <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl">
                    {selectedMessage.is_read ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-700">
                          Marked as Read
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-amber-500" />
                        <span className="text-sm font-bold text-amber-700">Unread</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    {!selectedMessage.is_read && (
                      <button
                        onClick={() => {
                          handleMarkAsRead(selectedMessage.id);
                          setSelectedMessage(null);
                        }}
                        className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-2 border-slate-200"
              >
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Delete Message
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Are you sure you want to delete this message? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={cancelDelete}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageList;
