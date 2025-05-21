"use client";

import { useEffect, useState } from 'react';
import { Friend } from '@/lib/db';
import { friendsDB } from '@/lib/db';
import * as api from '@/lib/api';
import toast from 'react-hot-toast';
import StarryBackground from '@/app/components/StarryBackground';
import { TrashIcon, PencilIcon } from 'lucide-react';

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [formData, setFormData] = useState<Friend>({
    name: '',
    email: '',
    age: 0,
    description: '',
  });

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const localFriends = await friendsDB.getAllFriends();
      setFriends(localFriends);

      try {
        const apiFriends = await api.getFriends();
        setFriends(apiFriends);

        for (const friend of apiFriends) {
          await friendsDB.updateFriend(friend);
        }
        toast.success('Friends loaded successfully');
      } catch (apiError) {
        if (localFriends.length > 0) {
          console.warn('Using cached data:', apiError);
        } else {
          throw apiError;
        }
      }
    } catch (error) {
      console.error('Error loading friends:', error);
      const message = error instanceof Error ? error.message : 'Failed to load friends';
      toast.error(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFriend) {
        await api.updateFriend(formData);
        await friendsDB.updateFriend(formData);
      } else {
        await api.addFriend(formData);
        await friendsDB.addFriend(formData);
      }

      setFormData({ name: '', email: '', age: 0, description: '' });
      setEditingFriend(null);
      await loadFriends();
      toast.success(editingFriend ? 'Friend updated successfully' : 'Friend added successfully');
    } catch (error) {
      console.error('Error saving friend:', error);
      toast.error('Failed to save friend');
    }
  };

  const handleEdit = (friend: Friend) => {
    setEditingFriend(friend);
    setFormData(friend);
  };

  const handleDelete = async (email: string) => {
    try {
      await api.deleteFriend(email);
      await friendsDB.deleteFriend(email);
      await loadFriends();
      toast.success('Friend deleted successfully');
    } catch (error) {
      console.error('Error deleting friend:', error);
      toast.error('Failed to delete friend');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1222] text-white pt-32 pb-20 relative">
      <StarryBackground />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-300 via-gray-500 to-blue-800 bg-clip-text text-transparent">
          {editingFriend ? 'Edit Friend' : 'Add New Friend'}
        </h1>

        <div className="bg-[#1a2333]/80 backdrop-blur-sm p-6 rounded-xl border border-blue-900/30 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md bg-[#1a2333] border border-gray-700 text-white px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md bg-[#1a2333] border border-gray-700 text-white px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                required
                disabled={editingFriend !== null}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md bg-[#1a2333] border border-gray-700 text-white px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md bg-[#1a2333] border border-gray-700 text-white px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              {editingFriend && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingFriend(null);
                    setFormData({ name: '', email: '', age: 0, description: '' });
                  }}
                  className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-colors"
              >
                {editingFriend ? 'Update Friend' : 'Add Friend'}
              </button>
            </div>
          </form>
        </div>

        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
          Friends List
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <div
              key={friend.email}
              className="bg-[#1a2333]/80 backdrop-blur-sm p-6 rounded-xl border border-blue-900/30"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-blue-400">{friend.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(friend)}
                    className="p-2 rounded-md hover:bg-blue-900/30 transition-colors"
                  >
                    <PencilIcon size={16} className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(friend.email)}
                    className="p-2 rounded-md hover:bg-red-900/30 transition-colors"
                  >
                    <TrashIcon size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2">{friend.email}</p>
              <p className="text-gray-400 text-sm mb-2">Age: {friend.age}</p>
              <p className="text-gray-300">{friend.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}