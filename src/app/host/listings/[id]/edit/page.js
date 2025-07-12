// villagestay-frontend/src/app/host/listings/[id]/edit/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  PhotoIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  HomeIcon,
  UsersIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { listingsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { getImagePlaceholder } from '@/lib/utils';
import toast from 'react-hot-toast';

const EditListingPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, isHost } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price_per_night: '',
    property_type: 'homestay',
    max_guests: 2,
    amenities: [],
    house_rules: [],
    sustainability_features: [],
    is_active: true
  });

  useEffect(() => {
    if (!isHost) {
      toast.error('Access denied. Host account required.');
      router.push('/');
      return;
    }
    
    if (params.id) {
      fetchListing();
    }
  }, [isHost, router, params.id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getById(params.id);
      const listingData = response.data;
      
      // Verify ownership - check against user ID
      if (listingData.host?.id !== user.id) {
        toast.error('You can only edit your own listings');
        router.push('/host/listings');
        return;
      }
      
      setListing(listingData);
      
      // Populate form data
      setFormData({
        title: listingData.title || '',
        description: listingData.description || '',
        location: listingData.location || '',
        price_per_night: listingData.price_per_night || '',
        property_type: listingData.property_type || 'homestay',
        max_guests: listingData.max_guests || 2,
        amenities: listingData.amenities || [],
        house_rules: listingData.house_rules || [],
        sustainability_features: listingData.sustainability_features || [],
        is_active: listingData.is_active !== false
      });
      
      // Convert existing images to the format we need
      const existingImages = (listingData.images || []).map((url, index) => ({
        id: `existing_${index}`,
        url: url,
        preview: url,
        name: `Image ${index + 1}`,
        isExisting: true
      }));
      setImages(existingImages);
      
    } catch (error) {
      console.error('Failed to fetch listing:', error);
      toast.error('Failed to load listing details');
      router.push('/host/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location || !formData.price_per_night) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      toast.error('Please keep at least one image');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        images: images.map(img => img.url || img.preview),
        price_per_night: parseFloat(formData.price_per_night),
        max_guests: parseInt(formData.max_guests)
      };

      console.log('Updating listing with data:', updateData);

      await listingsAPI.update(params.id, updateData);
      toast.success('Listing updated successfully!');
      router.push('/host/listings');
    } catch (error) {
      console.error('Update listing error:', error);
      toast.error(error.response?.data?.error || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not an image`);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Max size is 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + index,
          file,
          url: event.target.result,
          preview: event.target.result,
          name: file.name,
          isExisting: false
        };
        
        setImages(prev => [...prev, newImage]);
      };
      
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const addAmenity = (amenity) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  const removeAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addHouseRule = () => {
    const rule = prompt('Enter a house rule:');
    if (rule && rule.trim()) {
      setFormData(prev => ({
        ...prev,
        house_rules: [...prev.house_rules, rule.trim()]
      }));
    }
  };

  const removeHouseRule = (index) => {
    setFormData(prev => ({
      ...prev,
      house_rules: prev.house_rules.filter((_, i) => i !== index)
    }));
  };

  const addSustainabilityFeature = (feature) => {
    if (!formData.sustainability_features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        sustainability_features: [...prev.sustainability_features, feature]
      }));
    }
  };

  const removeSustainabilityFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      sustainability_features: prev.sustainability_features.filter(f => f !== feature)
    }));
  };

  const popularAmenities = [
    'Wi-Fi', 'Home-cooked meals', 'Local guide', 'Traditional cuisine',
    'Cultural performances', 'Yoga sessions', 'Nature walks', 'Organic farming',
    'Handicraft workshop', 'Bicycle rental', 'Fireplace', 'Garden',
    'Parking', 'Air conditioning', 'Hot water', 'Laundry service'
  ];

  const sustainabilityOptions = [
    'solar_power', 'rainwater_harvesting', 'organic_farming', 'waste_composting',
    'local_sourcing', 'plastic_free', 'energy_efficient', 'water_conservation',
    'local_employment', 'cultural_preservation'
  ];

  const propertyTypes = [
    { value: 'homestay', label: 'Homestay', desc: 'Stay with a local family' },
    { value: 'farmstay', label: 'Farmstay', desc: 'Experience rural farm life' },
    { value: 'heritage_home', label: 'Heritage Home', desc: 'Traditional architecture' },
    { value: 'eco_lodge', label: 'Eco Lodge', desc: 'Sustainable accommodation' },
    { value: 'village_house', label: 'Village House', desc: 'Independent village home' },
    { value: 'cottage', label: 'Cottage', desc: 'Cozy countryside cottage' }
  ];

  if (!isHost) {
    return (
      <div className="min-h-screen village-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only hosts can edit listings.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen village-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen village-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
          <p className="text-gray-600 mb-6">The listing you're trying to edit doesn't exist.</p>
          <button
            onClick={() => router.push('/host/listings')}
            className="btn-primary"
          >
            Back to My Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen village-bg pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/host/listings')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to My Listings</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Edit Listing ✏️
          </h1>
          <p className="text-gray-600">
            Update your property details: <strong>{listing.title}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Traditional Rajasthani Haveli Experience"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your property, what makes it special, and the experience guests can expect..."
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Village, District, State"
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Night (₹) *
                  </label>
                  <div className="relative">
                    <CurrencyRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="500"
                      value={formData.price_per_night}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_per_night: e.target.value }))}
                      placeholder="2000"
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Property Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Property Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, property_type: type.value }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        formData.property_type === type.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900">{type.label}</h3>
                      <p className="text-sm text-gray-600">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Guests *
                </label>
                <div className="relative">
                  <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.max_guests}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_guests: parseInt(e.target.value) }))}
                    className="input-field pl-10"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Keep this listing active and available for booking
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Amenities</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {popularAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => 
                        formData.amenities.includes(amenity) 
                          ? removeAmenity(amenity)
                          : addAmenity(amenity)
                      }
                      className={`p-3 rounded-lg border text-sm transition-all duration-200 ${
                        formData.amenities.includes(amenity)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {formData.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Amenities ({formData.amenities.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* House Rules */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">House Rules</h2>
            
            <div className="space-y-4">
              {formData.house_rules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1 text-gray-700">{rule}</span>
                  <button
                    type="button"
                    onClick={() => removeHouseRule(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addHouseRule}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add House Rule</span>
              </button>
            </div>
          </div>

          {/* Sustainability Features */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sustainability Features</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sustainabilityOptions.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => 
                      formData.sustainability_features.includes(feature) 
                        ? removeSustainabilityFeature(feature)
                        : addSustainabilityFeature(feature)
                    }
                    className={`p-3 rounded-lg border text-sm transition-all duration-200 capitalize ${
                      formData.sustainability_features.includes(feature)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {feature.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {formData.sustainability_features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Features ({formData.sustainability_features.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.sustainability_features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm capitalize"
                      >
                        <span>{feature.replace('_', ' ')}</span>
                        <button
                          type="button"
                          onClick={() => removeSustainabilityFeature(feature)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Property Photos</h2>
            
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors duration-200">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Add More Photos</h3>
                  <p className="text-gray-600">Choose multiple photos that showcase your property</p>
                  <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, GIF (Max 5MB each)</p>
                </label>
              </div>

              {images.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Current Photos ({images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.preview || image.url}
                          alt={image.name}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = getImagePlaceholder(200, 96, 'Property Image');
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        {image.isExisting && (
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                            Current
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                          {image.name.slice(0, 8)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/host/listings')}
              className="btn-secondary"
              disabled={saving}
            >
              Cancel Changes
            </button>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving || images.length === 0}
                className={`btn-primary ${(!images.length || saving) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update Listing'
                )}
              </button>
            </div>
          </div>

          {/* Help text */}
          {images.length === 0 && (
            <div className="text-center">
              <p className="text-sm text-red-600">
                Please keep at least one photo for your listing
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditListingPage;