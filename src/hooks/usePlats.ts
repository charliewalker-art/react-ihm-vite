import { useState, useCallback } from 'react';
import axiosInstance from './axiosInstance';
import type { Plat, PlatRequest } from '../types/plat';

export const usePlats = () => {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/plats');
      setPlats(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des plats');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.imageUrl;
  };

  const createPlat = async (data: PlatRequest, file?: File | null) => {
    try {
      let imageUrl = data.imageUrl;
      if (file) {
        imageUrl = await uploadImage(file);
      }
      await axiosInstance.post('/api/plats', { ...data, imageUrl });
      await fetchPlats();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erreur de création');
    }
  };

  const updatePlat = async (id: number, data: PlatRequest, file?: File | null) => {
    try {
      let imageUrl = data.imageUrl;
      if (file) {
        imageUrl = await uploadImage(file);
      }
      await axiosInstance.put(`/api/plats/${id}`, { ...data, imageUrl });
      await fetchPlats();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erreur de modification');
    }
  };

  const toggleDisponible = async (id: number) => {
    try {
      await axiosInstance.patch(`/api/plats/${id}/toggle`);
      await fetchPlats();
    } catch (err: any) {
      console.error(err);
    }
  };

  const declarerPerte = async (id: number, quantite: number) => {
    try {
      await axiosInstance.patch(`/api/plats/${id}/perte/${quantite}`);
      await fetchPlats();
    } catch (err: any) {
      console.error(err);
    }
  };

  const deletePlat = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/plats/${id}`);
      await fetchPlats();
    } catch (err: any) {
      console.error(err);
    }
  };

  return { plats, loading, error, fetchPlats, createPlat, updatePlat, toggleDisponible, declarerPerte, deletePlat };
};