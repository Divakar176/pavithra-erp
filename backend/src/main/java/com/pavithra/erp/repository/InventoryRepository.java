package com.pavithra.erp.repository;

import com.pavithra.erp.model.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    
    @Query("SELECT i FROM InventoryItem i WHERE i.stockQuantity <= i.reorderLevel")
    List<InventoryItem> findLowStockItems();
}
