package com.pavithra.erp.service;

import com.pavithra.erp.model.entity.InventoryItem;
import com.pavithra.erp.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public List<InventoryItem> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public List<InventoryItem> getLowStockItems() {
        return inventoryRepository.findLowStockItems();
    }

    public InventoryItem saveInventoryItem(InventoryItem item) {
        return inventoryRepository.save(item);
    }

    public InventoryItem updateStock(Long id, Integer quantityChange) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setStockQuantity(item.getStockQuantity() + quantityChange);
        return inventoryRepository.save(item);
    }

    public void deleteInventoryItem(Long id) {
        inventoryRepository.deleteById(id);
    }
}
