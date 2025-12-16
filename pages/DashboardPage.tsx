import React, { useState } from 'react';
import IndividualDashboard from '../components/dashboard/IndividualDashboard';
import DealerDashboard from '../components/dashboard/DealerDashboard';
import AddListingModal from '../components/AddListingModal';

export type UserRole = 'individual' | 'dealer';

interface DashboardPageProps {
  listings?: any[];
  onAddListing?: (listing: any) => void;
  onDeleteListing?: (id: number) => void;
  onEditListing?: (id: number) => void;
  onUpdateListing?: (listing: any) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  listings = [],
  onAddListing = () => { },
  onDeleteListing = () => { },
  // onEditListing prop is overridden below to manage state locally, but we keep the structure
  onUpdateListing = () => { }
}) => {
  const [userRole, setUserRole] = useState<UserRole>('individual');
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);

  const handleEditClick = (id: number) => {
    const listingToEdit = listings.find(l => l.id === id);
    if (listingToEdit) {
      setEditingListing(listingToEdit);
      setIsAddListingOpen(true);
    }
  };

  const handleModalSubmit = (data: any) => {
    if (editingListing) {
      onUpdateListing({ ...data, id: editingListing.id });
    } else {
      onAddListing(data);
    }
    setEditingListing(null);
  };

  const handleCloseModal = () => {
    setIsAddListingOpen(false);
    setEditingListing(null);
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'individual':
        return <IndividualDashboard
          onAddListingClick={() => setIsAddListingOpen(true)}
          listings={listings}
          onDeleteListing={onDeleteListing}
          onEditListing={handleEditClick}
        />;
      case 'dealer':
        return <DealerDashboard
          onAddListingClick={() => setIsAddListingOpen(true)}
          listings={listings}
          onDeleteListing={onDeleteListing}
          onEditListing={handleEditClick}
        />;
      default:
        return <IndividualDashboard
          onAddListingClick={() => setIsAddListingOpen(true)}
          listings={listings}
          onDeleteListing={onDeleteListing}
          onEditListing={handleEditClick}
        />;
    }
  };

  const RoleButton: React.FC<{ role: UserRole, label: string }> = ({ role, label }) => (
    <button
      onClick={() => setUserRole(role)}
      className={`px-5 py-2 text-sm font-semibold rounded-xl transition-colors duration-300 ${userRole === role ? 'bg-accent text-primary' : 'bg-secondary hover:bg-white/5'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-primary">
      {/* Role Switcher for Demo - Floating Top Right or subtle */}
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <div className="bg-secondary/50 border border-white/5 rounded-xl p-1 flex gap-1 shadow-soft">
          <RoleButton role="individual" label="Individual View" />
          <RoleButton role="dealer" label="Dealer View" />
        </div>
      </div>

      {renderDashboard()}

      <AddListingModal
        isOpen={isAddListingOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        initialData={editingListing}
      />
    </div>
  );
};

export default DashboardPage;